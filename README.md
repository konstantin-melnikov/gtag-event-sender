# gtag-event-sender
Send Google Analytics events via HTML attributes. You can send click, scroll and submit events by simply writing attributes in HTML tags.
## Install
```
npm install gtag-event-sender
```
## Usage
### In HTML

```html
<script src="../dist/gtag_event_sender.min.js?env=dev&id=UA-11111111-1"></script>
```
Use param `env=dev` for run script in development mode. `REMOVE` this parameter in prodaction.
In this mode you can see log in development console and your event not be sent to Google Analystics.

Specify your Google Analystics ID `id=UA-11111111-1`. Not use this parameter if you want to include Gtag tracking code manualy.
### In Webpack
```js
import gtagEventSender from "gtag-event-sender";
```
Then
```js
gtagEventSender.init(env, id);
```
Where `env = prov|dev`, `id`  your Google Analystics ID. Use `id=false` this parameter if you want to include Gtag tracking code manualy.

### How send events
You can send 3 types of event - `click`, `scroll`, `submit`
For send event use tag attributes in HTML
| Attribute name | Description |
|----------------|-------------|
| gtag                | `click`, `scroll`, `submit` |
| gtag_action         | The value that will appear as the event action in Google Analytics Event reports. |
| gtag_event_category | The category of the event. (optional) |
| gtag_event_label    | The label of the event. (optional) |
| gtag_value          | A non-negative integer that will appear as the vent value. (optional) |

See more https://developers.google.com/analytics/devguides/collection/gtagjs/events?hl=en#send_events

Examples:
```html
<button
    gtag='click'
    gtag_action='button click'
    gtag_event_category='Buttons'
    gtag_event_label='Click me'
>
    Send click event
</button>
```

```html
<form
    action="/"
    method="POST"
    gtag='submit'
    gtag_action='send form'
    gtag_event_category='Forms'
    gtag_event_label='Send me'
    gtag_value='1'
>
    <button>Send me</button>
</form>
```

```html
<div
    gtag='scroll'
    gtag_action='scroll to block'
    gtag_event_category='Div'
    gtag_event_label='Scroll to me'
>
    Scroll to me
</div>
```