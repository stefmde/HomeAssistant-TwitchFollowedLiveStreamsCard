
# Twitch Followed Live Streams Card for HomeAssistant

  

## Description
This card for HomeAssistant allows you to see all your favorite Twitch streamers who are currently live. You can heavily customize this card and show/hide information or set streams to ✭VIP or hidden.

  

## Properties

### Global

| Name | Type | Default | Description |
|--|--|--|--|
| `global_credentials_user_name` | `string` | `null` | Your Twitch username. Will break the card and log an error if empty or invalid. |
| `global_credentials_access_token` | `string` | `null` | The AccessToken of your Twitch app. See below on how to create one. Will break the card and log an error if empty or invalid. |
| `global_credentials_client_id` | `string` | `null` | The ClientId of your Twitch app. See below on how to create one. Will break the card and log an error if empty or invalid. |
| `global_debug` | `bool` | `false` | Can be set to `true` if you have problems to see more details in the console log |
| `global_show_header` | `bool` | `true` | Shows the card header with the count if set to `true` |


### Streams

| Name | Type | Default | Description |
|--|--|--|--|
| `global_text_align` | `string` | `center` | Could be `center`, `left` or `right`. The alignment of the text |


## Twitch add app
https://dev.twitch.tv/console/apps


## Samples

### My favorite

![Sample image to show the config](https://raw.githubusercontent.com/stefmde/HomeAssistantSimpleDateTimeClockCard/0e3e401b2cac73182ac525d7ce33b88ce2107278/img/header.png)

  

type: custom:simple-date-time-clock-card

time_seconds_visibility_percentage: 30%

time_seconds_font_size: 0.5em

date_week_number_show: true

  
  
  
  

### Debug