
# Twitch Followed Live Streams Card for HomeAssistant

  

## Description
This card for HomeAssistant allows you to see all your favorite Twitch streamers who are currently live. You can heavily customize this card and show/hide information or set streams to ✭VIP or hidden.

  

## Properties

### Global

| Name | Type | Default | Description |
|--|--|--|--|
| `global_credentials_access_token` | `string` | `null` | The AccessToken of your Twitch app. [See below on how to create one.](https://github.com/stefmde/HomeAssistant-TwitchFollowedLiveStreamsCard/tree/main#twitch-add-dev-app) Will break the card and log an error if empty or invalid. |
| `global_credentials_client_id` | `string` | `null` | The ClientId of your Twitch app. [See below on how to create one.](https://github.com/stefmde/HomeAssistant-TwitchFollowedLiveStreamsCard/tree/main#twitch-add-dev-app) Will break the card and log an error if empty or invalid. |
| `global_credentials_user_name` | `string` | `null` | Your Twitch username. Will break the card and log an error if empty or invalid. |
| `global_debug` | `bool` | `false` | Can be set to `true` if you have problems to see more details in the console log. |
| `global_show_header` | `bool` | `true` | Shows the card header with the count if set to `true`. |
| `global_update_interval_s` | `int` | `60` | The time in seconds used for the interval to update the streams displayed. |


### Streams

| Name | Type | Default | Description |
|--|--|--|--|
| `streams_disable_auto_refresh` | `bool` | `false` | Disables auto refreshing the streams if set to `true`. Can be useful if you want to refresh it manually. |
| `streams_disable_click_to_view` | `bool` | `false` | Disables the behavior to open the stream in a new tab if set to `true`. |
| `streams_font_size_game` | `string` | `0.8em` | Sets the font size of the game name. |
| `streams_font_size_title` | `string` | `1em` | Sets the font size of the stream title. |
| `streams_font_size_user_name` | `string` | `1em` | Sets the font size of the user name of the streamer. |
| `streams_font_size_viewers` | `string` | `0.8em` | Sets the font size of the viewer count. |
| `streams_hide` | `list` | `EMPTY` | Can hide the given streams from the list. |
| `streams_image_size_height` | `string` | `4em` | Sets the size of the image. |
| `streams_image_size_width` | `string` | `3em` | Sets the size of the image. |
| `streams_image_type` | `string` | `user` | Values can be `user` and `stream`. The first one will be the profile picture of the user/streamer and the second one a screenshot of the stream. See `streams_show_image` to hide it |
| `streams_limit_count` | `int` | `100` | Can be used to limit the number of streams that will be displayed. Values can be between `1` and `100`. |
| `streams_padding_bottom_size` | `string` | `0em` | Sets the paddings of the steams. |
| `streams_padding_left_size` | `string` | `1em` | Sets the paddings of the steams. |
| `streams_padding_right_size` | `string` | `1em` | Sets the paddings of the steams. |
| `streams_padding_top_size` | `string` | `0em` | Sets the paddings of the steams. |
| `streams_reduce_requests` | `bool` | `true` | Reduces the requests to the Twitch APIs. May cause a little lag to the live data. Set it to `false` if data is to async to live. |
| `streams_show_game` | `bool` | `true` | Shows or hides the name of the game. |
| `streams_show_image` | `bool` | `true` | Shows or hides the image of the stream or the user. See `streams_image_type`. |
| `streams_show_title` | `bool` | `true` | Shows or hides the title of the stream. The title could be really long. See `streams_title_height` to address that problem. |
| `streams_show_user_name` | `bool` | `true` | Shows or hides the username of the streamer. May always be shown. |
| `streams_show_viewers` | `bool` | `true` | Shows or hides the count of the viewers. |
| `streams_spacing_horivontal` | `string` | `1em` | The spacing between the images and the details of the stream. |
| `streams_spacing_vertical` | `string` | `1em` | The spacing between the streams. |
| `streams_title_height` | `string` | `1.2em` | The height that is given to the stream title to cap its possible excessive length. |
| `streams_vip` | `list` | `EMPTY` | Will show a golden `✭` in front of the user name of the streamer to mark it as an VIP/favorite. |


## Twitch add dev app
This information is needed for the `global_credentials_access_token` and `global_credentials_client_id` property.
 1. Login to your twitch account here: https://twitch.tv
 2. Navigate to the developers console here: https://dev.twitch.tv/console/apps
 3. Click `Add` on the top right.
 4. Provide the following values:
	 4.1. Name: `HomeAssistant Live Streamers`. Or something you like.
	 4.2. OAuth Redirect URLs: `https://my.home-assistant.io/redirect/devices/`
	 4.3. Category: `Website Integration`
5. Click `Create`
6. Copy the `Client-ID` for the property `global_credentials_client_id`.
7. Copy or create the `Client-Secret` for the property  `global_credentials_access_token`.
8. Now you're set to use the integration.


## Samples

### My favorite

![Sample image to show the config](https://raw.githubusercontent.com/stefmde/HomeAssistant-TwitchFollowedLiveStreamsCard/main/img/favorite_config.png)

    type: custom:twitch-followed-live-streams-card
    global_debug: true
    global_credentials_user_name: StefmDE
    global_credentials_access_token: sFGFNMmD6ELCMhtFMzZcvb4nNyWx
    global_credentials_client_id: k9eyo9vxpjghwQ6XsYNxJBPBdGtH
    streams_limit_count: 8
    streams_image_show: false
    streams_show_viewers: false
    streams_show_title: false
    streams_vip:
      - Wirtual
      - Scrapie
      - Jnic


### Basic
![Sample image to show the config](https://raw.githubusercontent.com/stefmde/HomeAssistant-TwitchFollowedLiveStreamsCard/main/img/basic_config.png)

    type: custom:twitch-followed-live-streams-card
    global_credentials_user_name: StefmDE
    global_credentials_access_token: sFGFNMmD6ELCMhtFMzZcvb4nNyWx
    global_credentials_client_id: k9eyo9vxpjghwQ6XsYNxJBPBdGtH


### Stream Image
![Sample image to show the config](https://raw.githubusercontent.com/stefmde/HomeAssistant-TwitchFollowedLiveStreamsCard/main/img/stream_image_config.png)

    type: custom:twitch-followed-live-streams-card
    global_credentials_user_name: StefmDE
    global_credentials_access_token: sFGFNMmD6ELCMhtFMzZcvb4nNyWx
    global_credentials_client_id: k9eyo9vxpjghwQ6XsYNxJBPBdGtH
    streams_image_type: stream


### VIPs
![Sample image to show the config](https://raw.githubusercontent.com/stefmde/HomeAssistant-TwitchFollowedLiveStreamsCard/main/img/vips_config.png)

    type: custom:twitch-followed-live-streams-card
    global_credentials_user_name: StefmDE
    global_credentials_access_token: sFGFNMmD6ELCMhtFMzZcvb4nNyWx
    global_credentials_client_id: k9eyo9vxpjghwQ6XsYNxJBPBdGtH
    streams_vip:
      - Jnic


## Debug
You can use the property `global_debug` and set it to `true` to see more logs in the console.