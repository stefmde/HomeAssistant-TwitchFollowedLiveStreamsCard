class TwitchFollowedLiveStreamsCard extends HTMLElement
{
    set hass(hass)
    {
        if (!this.content)
        {
            const config = this.config;
            const card = document.createElement('HA-card');

            // ### BASIC ELEMENTS
            // ##################################################

            // ### Global
            this.content = document.createElement('div');
            card.appendChild(this.content);
            this.appendChild(card);
            const content = this.content;

            // ### StreamsCount
            const streamsCountDiv = document.createElement('div');

            // ### Streams
            const streamsDiv = document.createElement('div');
            streamsDiv.style.overflow = "hidden";
            streamsDiv.style.paddingLeft = this.config.streams_padding_left_size !== undefined ? this.config.streams_padding_left_size : "1em";
            streamsDiv.style.paddingRight = this.config.streams_padding_right_size !== undefined ? this.config.streams_padding_right_size : "1em";
            streamsDiv.style.paddingTop = this.config.streams_padding_top_size !== undefined ? this.config.streams_padding_top_size : "0em";
            streamsDiv.style.paddingBottom = this.config.streams_padding_bottom_size !== undefined ? this.config.streams_padding_bottom_size : "0em";

            // ### Constants
            const const_url_get_user = "https://api.twitch.tv/helix/users?";
            const const_url_get_user_streams = "https://api.twitch.tv/helix/streams/followed?user_id=";

            // ### Get Config
            // Global
            const config_global_update_interval_s = this.config.global_update_interval_s !== undefined ? this.config.global_update_interval_s * 1000 : 60 * 1000;
            const config_global_credentials_user_name = this.config.global_credentials_user_name !== undefined ? this.config.global_credentials_user_name : null;
            const config_global_credentials_access_token = this.config.global_credentials_access_token !== undefined ? this.config.global_credentials_access_token : null;
            const config_global_credentials_client_id = this.config.global_credentials_client_id !== undefined ? this.config.global_credentials_client_id : null;
            const config_global_debug = this.config.global_debug !== undefined ? this.config.global_debug : false;
            const config_global_show_header = this.config.global_show_header !== undefined ? this.config.global_show_header : true;

            // Streams
            const config_streams_disable_auto_refresh = this.config.streams_disable_auto_refresh !== undefined ? this.config.streams_disable_auto_refresh : false;
            const config_streams_disable_click_to_view = this.config.streams_disable_click_to_view !== undefined ? this.config.streams_disable_click_to_view : false;
            const config_streams_limit_count = this.config.streams_limit_count !== undefined ? this.config.streams_limit_count : 100;
            const config_streams_show_image = this.config.streams_show_image !== undefined ? this.config.streams_show_image : true;
            const config_streams_image_type = this.config.streams_image_type !== undefined ? this.config.streams_image_type : "user";
            const config_streams_image_size_height = this.config.streams_image_size_height !== undefined ? this.config.streams_image_size_height : "4em";
            const config_streams_image_size_width = this.config.streams_image_size_width !== undefined ? this.config.streams_image_size_width : "3em";
            const config_streams_spacing_horivontal = this.config.streams_spacing_horivontal !== undefined ? this.config.streams_spacing_horivontal : "1em";
            const config_streams_spacing_vertical = this.config.streams_spacing_vertical !== undefined ? this.config.streams_spacing_vertical : "1em";
            
            const config_streams_font_size_game = this.config.streams_font_size_game !== undefined ? this.config.streams_font_size_game : "0.8em";
            const config_streams_font_size_user_name = this.config.streams_font_size_user_name !== undefined ? this.config.streams_font_size_user_name : "1em";
            const config_streams_font_size_viewers = this.config.streams_font_size_viewers !== undefined ? this.config.streams_font_size_viwers : "0.8em";
            const config_streams_font_size_title = this.config.streams_font_size_title !== undefined ? this.config.streams_font_size_title : "1em";
            const config_streams_title_height = this.config.streams_title_height !== undefined ? this.config.streams_title_height : "1.2em";
            
            const config_streams_show_game = this.config.streams_show_game !== undefined ? this.config.streams_show_game : true;
            const config_streams_show_user_name = this.config.streams_show_user_name !== undefined ? this.config.streams_show_user_name : true;
            const config_streams_show_viewers = this.config.streams_show_viewers !== undefined ? this.config.streams_show_viewers : true;
            const config_streams_show_title = this.config.streams_show_title !== undefined ? this.config.streams_show_title : true;

            const config_streams_vip = this.config.streams_vip !== undefined ? this.config.streams_vip : [];
            const config_streams_hide = this.config.streams_hide !== undefined ? this.config.streams_hide : [];
            const config_streams_reduce_requests = this.config.streams_reduce_requests !== undefined ? this.config.streams_reduce_requests : true;

            let priviousStreamCount = 0;
            let currentUser = null;

            // ### Functions
            // ##################################################
            async function main()
            {
                checkRequiredProperties();
                await getCurrentUser();
                const streams = await getJson(const_url_get_user_streams + currentUser[0].id);

                if(streams.length == priviousStreamCount || streams.length == 0 || !config_streams_reduce_requests) {
                    return;
                }
                priviousStreamCount = streams.length;

                const streamers = await getStreamers(streams);
                printHeader(streams.length);
                await printStreams(streams, streamers);
                content.style.padding = "0em";
            }

            // ### Local Helpers
            function checkRequiredProperties() {
                if(config_global_credentials_user_name == null) {
                    console.error("TwitchFollowedLiveStreamsCard: Property 'global_credentials_user_name' is required and not set.");
                }
                if(config_global_credentials_access_token == null) {
                    console.error("TwitchFollowedLiveStreamsCard: Property 'global_credentials_access_token' is required and not set.");
                }
                if(config_global_credentials_client_id == null) {
                    console.error("TwitchFollowedLiveStreamsCard: Property 'global_credentials_client_id' is required and not set.");
                }
            }

            async function getJson(url) {
                let json_data = await fetch(url, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + config_global_credentials_access_token,
                        'Client-Id': config_global_credentials_client_id
                    }
                    })
                    .then(resp => resp.json())
                    .then(json => {
                        return JSON.parse(JSON.stringify(json.data));
                    });
                return json_data;
            }

            async function getCurrentUser() {
                if(currentUser == null || !config_streams_reduce_requests) {
                    currentUser = await getJson(const_url_get_user + "login=" + config_global_credentials_user_name);
                }
            }

            function printHeader(streamsCount) {
                if(config_global_show_header) {
                    const streamsCountDivH = document.createElement('h1');
                    streamsCountDivH.classList.add("card-header");
                    streamsCountDivH.innerText = streamsCount + " streams live";
                    streamsCountDiv.innerHTML = streamsCountDivH.outerHTML;

                    content.innerHTML = streamsCountDiv.outerHTML;
                }
            }

            async function getStreamers(streams) {
                let userQuery = "";
                for (let i = 0; i < streams.length; i++) {
                    userQuery += "login=" + streams[i].user_login + "&"
                }
                return await getJson(const_url_get_user + userQuery);
            }

            async function printStreams(streams, streamers) {
                const streamsTable = document.createElement('table');
                let skipped = 0;
                for (let i = 0; i < streams.length && i < config_streams_limit_count + skipped; i++) {
                    const stream = streams[i];
                    const streamer = streamers.find(obj => {
                        return obj.login === stream.user_login;
                    });
                    const streamContent = await printStream(stream, streamer);
                    if(streamContent == null) {
                        skipped++;
                        continue;
                    }
                    streamsTable.innerHTML += streamContent;
                }
                if(config_global_debug) console.log("TwitchFollowedLiveStreamsCard: " + skipped + " twitch streams hidden due to the 'streams_hide' setting");

                streamsDiv.innerHTML = streamsTable.outerHTML;
                content.innerHTML += streamsDiv.outerHTML;
            }

            async function printStream(stream, streamer) {
                const isVip = config_streams_vip.length > 0 && config_streams_vip.some((x) => x.toString().toLowerCase() == streamer.login);
                const isHidden = config_streams_hide.length > 0 && config_streams_hide.some((x) => x.toString().toLowerCase() == streamer.login);
                if(isHidden && !isVip) {
                    return null;
                }
                
                const streamContainerTr = document.createElement('tr');
                if(!config_streams_disable_click_to_view) {
                    streamContainerTr.setAttribute("onClick", "window.open('https://www.twitch.tv/'" + stream.user_login + ")");
                    streamContainerTr.style.cursor = "pointer";
                }
                streamContainerTr.style.marginTop = "1.2em!important";
                streamContainerTr.style.borderBottom = "solid 1px";

                // Image
                if(config_streams_show_image) {
                    const streamImageTd = document.createElement('td');
                    streamImageTd.style.width = "100px!important";
                    streamImageTd.style.paddingBottom = config_streams_spacing_vertical;
                    
                    const streamImageTdImg = document.createElement('img');
                    streamImageTdImg.style.height = config_streams_image_size_height;
                    streamImageTdImg.style.width = config_streams_image_size_width;
                    streamImageTdImg.style.paddingRight = config_streams_spacing_horivontal;

                    if(config_streams_image_type === "user") {
                        streamImageTdImg.setAttribute("src", streamer.profile_image_url);
                    }

                    if(config_streams_image_type === "stream") {
                        let url = stream.thumbnail_url;
                        url = url.replace("{height}", "400");
                        url = url.replace("{width}", "300");
                        streamImageTdImg.setAttribute("src", url);
                    }
                    
                    streamImageTd.innerHTML = streamImageTdImg.outerHTML;
                    streamContainerTr.innerHTML += streamImageTd.outerHTML;
                }
                
                // Details
                const streamDetailsTd = document.createElement('td');
                streamDetailsTd.style.marginLeft = "0.5em";
                streamDetailsTd.style.marginTop = "0.5em";
                streamDetailsTd.style.paddingBottom = config_streams_spacing_vertical;

                if(config_streams_show_game) {
                    let streamDetailsGameNameDiv = document.createElement('div');
                    streamDetailsGameNameDiv.style.fontSize = config_streams_font_size_game;
                    streamDetailsGameNameDiv.innerText = stream.game_name;
                    streamDetailsTd.innerHTML += streamDetailsGameNameDiv.outerHTML;
                }

                if(config_streams_show_user_name) {
                    let streamDetailsUserNameDiv = document.createElement('div');
                    streamDetailsUserNameDiv.style.fontWeight = "bold";
                    streamDetailsUserNameDiv.style.fontSize = config_streams_font_size_user_name;

                    if(isVip) {
                        let streamDetailsUserNameDivVipSpan = document.createElement('span');
                        streamDetailsUserNameDivVipSpan.innerText = "✭ ";
                        streamDetailsUserNameDivVipSpan.style.color = "GoldenRod";
                        streamDetailsUserNameDiv.innerHTML = streamDetailsUserNameDivVipSpan.outerHTML;
                    }

                    let streamDetailsUserNameDivUserNameSpan = document.createElement('span');
                    streamDetailsUserNameDivUserNameSpan.innerText = stream.user_name;
                    streamDetailsUserNameDiv.innerHTML += streamDetailsUserNameDivUserNameSpan.outerHTML;

                    streamDetailsTd.innerHTML += streamDetailsUserNameDiv.outerHTML;
                }

                if(config_streams_show_viewers) {
                    const streamDetailsViewerCountDiv = document.createElement('div');
                    streamDetailsViewerCountDiv.style.fontSize = config_streams_font_size_viewers;
    
                    const streamDetailsViewerCountDivIconSpan = document.createElement('span');
                    streamDetailsViewerCountDivIconSpan.style.color = "red";
                    streamDetailsViewerCountDivIconSpan.style.fontWeight = "bold";
                    streamDetailsViewerCountDivIconSpan.innerHTML = "●&nbsp;";
                    streamDetailsViewerCountDiv.innerHTML += streamDetailsViewerCountDivIconSpan.outerHTML;
    
                    const streamDetailsViewerCountDivCountSpan = document.createElement('span');
                    streamDetailsViewerCountDivCountSpan.innerText = stream.viewer_count + " viewers"; // TODO Dimm a little
                    streamDetailsViewerCountDiv.innerHTML += streamDetailsViewerCountDivCountSpan.outerHTML;
                    streamDetailsTd.innerHTML += streamDetailsViewerCountDiv.outerHTML;
                }

                if(config_streams_show_title) {
                    const streamDetailsTitleDiv = document.createElement('div');
                    streamDetailsTitleDiv.style.height = config_streams_title_height;
                    streamDetailsTitleDiv.style.fontSize = config_streams_font_size_title;
                    streamDetailsTitleDiv.style.overflow = "hidden";
                    streamDetailsTitleDiv.innerText = stream.title;
                    streamDetailsTd.innerHTML += streamDetailsTitleDiv.outerHTML;
                }

                streamContainerTr.innerHTML += streamDetailsTd.outerHTML;

                return streamContainerTr.outerHTML;
            }

            async function init() {
                if(config_global_debug) console.log("TwitchFollowedLiveStreamsCard: Loading streams...");
            
                content.innerHTML = "Loading twitch streams...<br><br>";
                content.style.padding = "1em";
                main();
                if(!config_streams_disable_auto_refresh) {
                    setInterval(async () => {
                        if(config_global_debug) console.log("TwitchFollowedLiveStreamsCard: Reloading streams...");
                        await main() 
                    }, config_global_update_interval_s);
                }
            }

            init();            
        }
    }

    setConfig(config) {
        this.config = config;
    }

    getCardSize() {
        return 1;
    }
}

customElements.define('twitch-followed-live-streams-card', TwitchFollowedLiveStreamsCard);

/*
# CONFIG

GLOBAL
global_debug
global_update_interval_s
global_credentials_user_name
global_credentials_access_token
global_credentials_client_id
global_show_header

STREAMS
streams_disable_auto_refresh
streams_disable_click_to_view
streams_font_size_game
streams_font_size_title
streams_font_size_user_name
streams_font_size_viewers
streams_hide
streams_image_size_height
streams_image_size_width
streams_image_type
streams_limit_count
streams_padding_bottom_size
streams_padding_left_size
streams_padding_right_size
streams_padding_top_size
streams_reduce_requests
streams_show_game
streams_show_image
streams_show_title
streams_show_user_name
streams_show_viewers
streams_spacing_horivontal
streams_spacing_vertical
streams_title_height
streams_vip
*/
