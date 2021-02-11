'use struct'

class GtagEventSender {
  env = 'prod'
  constructor() {
    const env = this.getParam('gtag_event_sender', 'env')
    const id = this.getParam('gtag_event_sender', 'id')
    this.init(env, id)
  }

  init(env, id) {
    if (env) {
      this.env = env
      this.log(`Script run in ${this.env} env`)
    }
    if (this.checkGtag()) {
      document.addEventListener('DOMContentLoaded', () => {
        this.initEvents()
      });
    } else {
      if (id) {
        this.initGtag(id)
        document.addEventListener('DOMContentLoaded', () => {
          this.initEvents()
        });
      }
    }
  }

  initGtag(id) {
    this.log(`Add Gtag script for ${id}`)
    const head = document.getElementsByTagName('head')[0]
    const script = document.createElement('script')
    script.async = true
    script.src=`https://www.googletagmanager.com/gtag/js?id=${id}`
    const code = document.createElement('script')
    code.text = `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${id}');`
    head.prepend(script, code)
  }

  initEvents() {
    const events = document.querySelectorAll("[gtag]")
    if (events !== undefined) {
      events.forEach((event) => {
        switch (event.getAttribute('gtag')) {
          case 'click':
            this.eventClick(event)
            break;
          case 'submit':
            this.eventSubmit(event)
            break;
          case 'scroll':
            this.eventScroll(event)
            break;
          default:
            this.log(`Method for event "${event.getAttribute('gtag')}" not found.`)
            break;
        }
      })
    }
  }
  eventClick(element) {
    element.addEventListener('click', (event) => {
      this.sendEvent(event.target)
    })
  }
  eventSubmit(element) {
    element.addEventListener('submit', (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.sendEvent(event.target)
      if (this.env == 'dev') {
        this.log({ message: 'Form can send in prod env' })
      } else {
        event.target.submit()
      }
    })
  }
  eventScroll(element) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.sendEvent(entry.target)
          observer.unobserve(entry.target)
        }
      })
    }, {})
    observer.observe(element)
  }
  sendEvent(target) {
    const action = target.getAttribute('gtag_action') || false
    if (!action) {
      this.log({message: 'Must be attribute gtag_action', target})
      return false
    }
    const arr = ['event_category', 'event_label', 'value']
    const params = {}
    arr.map((el) => {
      if (target.getAttribute(`gtag_${el}`)) {
        params[el] = target.getAttribute(`gtag_${el}`)
      }
    })
    if (this.env == 'dev') {
      this.log({ message: 'Sent event', event: ['event', action, params] })
    } else {
      gtag('event', action, params)
    }
  }

  setDevEnv() {
    this.env = 'dev'
  }

  log(variable) {
    if (this.env == 'dev') {
      let callerName
      try {
        throw new Error()
      }
      catch (e) {
        let re = /([^(]+)@|at ([^(]+) \(/g
        let aRegexResult = re.exec(e.stack)
        callerName = e.stack.split('at ')[2].split(' ')[0]
      }      
      console.log({
        func: callerName,
        obj: variable
      })
    }
  }

  checkGtag() {
    if (window.dataLayer === undefined) {
      this.log('Gtag is not init.')
      return false
    }
    return true
  }

  getParam(scriptName, paramName) {
    const scripts = document.getElementsByTagName("script");
    for(let i=0; i<scripts.length; i++) {
      if(scripts[i].src.indexOf("/" + scriptName) > -1) {
        const pa = scripts[i].src.split("?").pop().split("&");
        for(let j=0; j<pa.length; j++) {
          const kv = pa[j].split("=")
          if (kv[0] === paramName) {
            return kv[1]
          }
        }
        return false
      }
    }
    return false;
  }
}
const gtagEventSender = new GtagEventSender()

export default gtagEventSender