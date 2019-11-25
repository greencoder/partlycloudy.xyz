class NOAA {

  fetchAndParse(lat, lng) {
    return new Promise((resolve, reject) => {
      console.log('Fetching NOAA Weather');
      this.fetch(lat, lng).then(html => {
        console.log('Fetch complete. Parsing HTML.');
        let data = this.parse(html);
        resolve(data);
      }).catch(() => {
        reject('Could not fetch noaa');
      });
    });
  }

  async fetch(lat, lng) {
    let ts = Date.now();
    let url = `https://forecast.weather.gov/MapClick.php?lat=${lat}&lon=${lng}&cache=${ts}`;
    let response = await fetch(url);
    let html = await response.text();
    return html;
  }

  qsText(doc, selector, useHtml=false) {
    let element = doc.querySelector(selector);
    if (useHtml) {
      let html = element.innerHTML;
      let text = html.replace(/<br>/g, ' ');
      return text.trim();
    }
    else {
      return element ? element.textContent.trim() : '';
    }
  }

  qsImgSrcPath(doc, selector) {
    let element = doc.querySelector(selector);

    if (element) {
      let anchorElement = this.getLocation(element.src);
      let pathName = anchorElement.pathname;
      let index = anchorElement.href.indexOf(pathName);
      return anchorElement.href.slice(index);
    }

    return '';
  }

  getLocation(href) {
    let element = document.createElement("a");
    element.href = href;
    return element;
  }

  parseConditions(doc) {
    var humidity;
    var wind;
    var pressure;
    var dewpoint;
    var visibility;
    var windChill;
    var updated;

    let trElements = doc.querySelectorAll('#current_conditions_detail > table > tbody > tr');

    trElements.forEach(element => {
      let value = this.qsText(element, 'td:last-child');
      let label = this.qsText(element, 'td:first-child');

      switch(label) {
        case 'Humidity':
          humidity = value;
          break;
        case 'Wind Speed':
          wind = value.replace('Vrbl', 'Variable ');
          break;
        case 'Barometer':
          pressure = value;
          break;
        case 'Dewpoint':
          dewpoint = value.split(' ')[0];
          break;
        case 'Visibility':
          visibility = value
          break;
        case 'Wind Chill':
          windChill = value.split(' ')[0];
          break;
        case 'Last update':
          updated = value;
          break;
      }
    });

    let temperature = this.qsText(doc, '#current_conditions-summary > p.myforecast-current-lrg');

    // Visibility usually ends with "mi", we want "miles"
    visibility = visibility.endsWith('mi') ? `${visibility}les` : visibility;

    let iconPath = this.qsImgSrcPath(doc, '#current_conditions-summary > img');
    let icon = `https://forecast.weather.gov${iconPath}`;

    // Conditions can have embedded line breaks
    let conditions = this.qsText(doc, '#current_conditions-summary > p.myforecast-current', true);

    return {
      "icon": icon,
      "conditions": conditions,
      "temperature": temperature,
      "humidity": humidity,
      "wind": wind,
      "pressure": pressure,
      "dewpoint": dewpoint,
      "visibility": visibility,
      "wind_chill": windChill,
      "updated": updated,
    }
  }

  parseAlerts(doc) {
    let selector = 'body > main > div > div.panel.panel-danger > div.panel-body > ul > li > a'
    let elements = doc.querySelectorAll(selector);
    let alerts = [];

    elements.forEach(alert => {
      let name = alert.textContent.trim();
      if (name !== 'Hazardous Weather Outlook') {
        alerts.push({
          'href': alert.href,
          'name': name
        })
      }
    });

    return alerts;
  }

  parseLocation(doc) {
    let location = this.qsText(doc, '#current-conditions > div.panel-heading > div > h2');
    let name = location.split(' (')[0];
    let identifier = location.slice(location.length-5, location.length-1);

    return {
      "name": name,
      "identifier": identifier,
    }
  }

  parseRadar(doc) {
    let anchorElement = doc.querySelector('#radar > a:nth-child(2)');
    let path = this.qsImgSrcPath(doc, '#radar > a:nth-child(2) > img');
    let imgPath = `https://radar.weather.gov${path}`;

    return {
      "href": anchorElement.href,
      "icon": imgPath
    }
  }

  parseAbout(doc) {
    let locationElement = doc.querySelector('#about_forecast > div:nth-child(1) > div.right');
    let fullLocation = locationElement.innerHTML;
    let loc = fullLocation.split('<br>')[0];
    let geo = fullLocation.split('<br>')[1].slice(6);
    let title = `7-Day Forecast for ${loc} ${geo}`;

    return {
      "location": loc,
      "geo": geo,
      "title": title,
    }
  }

  parseSatellite(doc) {
    let anchorElement = doc.querySelector('#radar > a:nth-child(3)');
    let path = this.qsImgSrcPath(doc, '#radar > a:nth-child(3) > img');
    let imgPath = `https://forecast.weather.gov${path}`;

    return {
      "href": anchorElement.href,
      "icon": imgPath
    }
  }

  parseForecasts(doc) {
    let liElements = doc.querySelectorAll('#seven-day-forecast-list > li')
    let forecasts = [];

    liElements.forEach(tombstone => {
      let period = tombstone.querySelector('div > p.period-name').innerHTML.replace(/<br>/g, ' ');
      let descShort = this.qsText(tombstone, 'div > p.short-desc', true);

      var hiLo = this.qsText(tombstone, 'div > p.temp');
      let hiLoType = hiLo.startsWith('High') ? 'hi' : 'lo';
      hiLo = hiLo.replace(' °F', '°F');

      // sometimes they put weird unicode characters at the end of the hi/lo
      let endIndex = hiLo.indexOf('°F') + 2;
      hiLo = hiLo.slice(0, endIndex);

      let iconElement = tombstone.querySelector('img');
      let descLong = iconElement.alt.split(': ')[1].trim();

      let iconPath = this.qsImgSrcPath(tombstone, 'img');
      let icon = `https://forecast.weather.gov${iconPath}`;

      forecasts.push({
        "period": period,
        "descShort": descShort,
        "hiLo": hiLo,
        "hiLoType": hiLoType,
        "icon": icon,
        "descLong": descLong
      })
    });

    return forecasts;
  }

  parse(html) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");

    // Ensure relative links are based on the noaa domain
    let base = doc.createElement('base');
    base.href = 'https://forecast.weather.gov';
    doc.head.appendChild(base);

    return {
      "conditions": this.parseConditions(doc),
      "forecasts": this.parseForecasts(doc),
      "location": this.parseLocation(doc),
      "radar": this.parseRadar(doc),
      "satellite": this.parseSatellite(doc),
      "alerts": this.parseAlerts(doc),
      "about": this.parseAbout(doc)
    }
  }

}

export default NOAA;