
# Twitch Followed Live Streams Card for HomeAssistant

  

## Description
This card for HomeAssistant allows you to see all your favorite Twitch streamers who are currently live. You can heavily customize this card and show/hide information or set streams to ✭VIP or hidden.

  

## Properties

### Global

| Name | Type | Default | Description |
|--|--|--|--|
| `global_credentials_access_token` | `string` | `null` | The AccessToken of your Twitch app. See below on how to create one. Will break the card and log an error if empty or invalid. |
| `global_credentials_client_id` | `string` | `null` | The ClientId of your Twitch app. See below on how to create one. Will break the card and log an error if empty or invalid. |
| `global_credentials_user_name` | `string` | `null` | Your Twitch username. Will break the card and log an error if empty or invalid. |
| `global_debug` | `bool` | `false` | Can be set to `true` if you have problems to see more details in the console log |
| `global_show_header` | `bool` | `true` | Shows the card header with the count if set to `true` |


### Streams

| Name | Type | Default | Description |
|--|--|--|--|
| `streams_disable_auto_refresh` | `bool` | `false` |  |
| `streams_disable_click_to_view` | `bool` | `false` |  |
| `streams_font_size_game` | `string` | `0.8em` |  |
| `streams_font_size_title` | `string` | `1em` |  |
| `streams_font_size_user_name` | `string` | `1em` |  |
| `streams_font_size_viewers` | `string` | `0.8em` |  |
| `streams_hide` | `list` | `EMPTY` |  |
| `streams_image_size_height` | `string` | `4em` |  |
| `streams_image_size_width` | `string` | `3em` |  |
| `streams_image_type` | `string` | `user` | Values can be `user` and `stream`. The first one will be the profile picture of the user/streamer and the second one a screenshot of the stream. |
| `streams_limit_count` | `int` | `100` | Can be used to limit the number of streams that will be displayed. Values can be between `1` and `100`. |
| `streams_padding_bottom_size` | `string` | `0em` |  |
| `streams_padding_left_size` | `string` | `1em` |  |
| `streams_padding_right_size` | `string` | `1em` |  |
| `streams_padding_top_size` | `string` | `0em` |  |
| `streams_reduce_requests` | `bool` | `true` |  |
| `streams_show_game` | `bool` | `true` |  |
| `streams_show_image` | `bool` | `true` |  |
| `streams_show_title` | `bool` | `true` |  |
| `streams_show_user_name` | `bool` | `true` |  |
| `streams_show_viewers` | `bool` | `true` |  |
| `streams_spacing_horivontal` | `string` | `1em` |  |
| `streams_spacing_vertical` | `string` | `1em` |  |
| `streams_title_height` | `string` | `1.2em` |  |
| `streams_vip` | `list` | `EMPTY` |  |


## Twitch add dev app
https://dev.twitch.tv/console/apps


## Samples

### My favorite

![Sample image to show the config](https://raw.githubusercontent.com/stefmde/HomeAssistantSimpleDateTimeClockCard/0e3e401b2cac73182ac525d7ce33b88ce2107278/img/header.png)

  

type: custom:simple-date-time-clock-card

time_seconds_visibility_percentage: 30%

time_seconds_font_size: 0.5em

date_week_number_show: true

  
  
  
  

### Debug