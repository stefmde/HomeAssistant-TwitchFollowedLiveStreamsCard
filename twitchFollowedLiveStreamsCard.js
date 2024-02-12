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
            this.content = document.createElement("div");
            card.appendChild(this.content);
            this.appendChild(card);
            const content = this.content;

            // ### StreamsCount
            const streamsCountDiv = document.createElement("div");

            // ### Streams
            const streamsDiv = document.createElement("div");
            streamsDiv.style.overflow = "hidden";
            streamsDiv.style.paddingLeft = this.config.streams_padding_left_size !== undefined ? this.config.streams_padding_left_size : "1em";
            streamsDiv.style.paddingRight = this.config.streams_padding_right_size !== undefined ? this.config.streams_padding_right_size : "1em";
            streamsDiv.style.paddingTop = this.config.streams_padding_top_size !== undefined ? this.config.streams_padding_top_size : "0em";
            streamsDiv.style.paddingBottom = this.config.streams_padding_bottom_size !== undefined ? this.config.streams_padding_bottom_size : "0em";

            // ### Get Config
            // Global
            const config_global_debug = this.config.global_debug !== undefined ? this.config.global_debug : false;
            const config_global_show_header = this.config.global_show_header !== undefined ? this.config.global_show_header : true;
            const config_global_update_interval_s = this.config.global_update_interval_s !== undefined ? this.config.global_update_interval_s * 1000 : 60 * 1000;

            // Streams
            const config_streams_disable_auto_refresh = this.config.streams_disable_auto_refresh !== undefined ? this.config.streams_disable_auto_refresh : false;
            const config_streams_disable_click_to_view = this.config.streams_disable_click_to_view !== undefined ? this.config.streams_disable_click_to_view : false;
            
            const config_streams_font_size_game = this.config.streams_font_size_game !== undefined ? this.config.streams_font_size_game : "0.8em";
            const config_streams_font_size_title = this.config.streams_font_size_title !== undefined ? this.config.streams_font_size_title : "1em";
            const config_streams_font_size_user_name = this.config.streams_font_size_user_name !== undefined ? this.config.streams_font_size_user_name : "1em";
            const config_streams_font_size_viewers = this.config.streams_font_size_viewers !== undefined ? this.config.streams_font_size_viwers : "0.8em";
            
            const config_streams_hide = this.config.streams_hide !== undefined ? this.config.streams_hide : [];
            const config_streams_image_size_height = this.config.streams_image_size_height !== undefined ? this.config.streams_image_size_height : "4em";
            const config_streams_image_size_width = this.config.streams_image_size_width !== undefined ? this.config.streams_image_size_width : "3em";
            const config_streams_limit_count = this.config.streams_limit_count !== undefined ? this.config.streams_limit_count : 100;
            const config_streams_reduce_requests = this.config.streams_reduce_requests !== undefined ? this.config.streams_reduce_requests : true;
            
            const config_streams_show_game = this.config.streams_show_game !== undefined ? this.config.streams_show_game : true;
            const config_streams_show_image = this.config.streams_show_image !== undefined ? this.config.streams_show_image : true;
            const config_streams_show_title = this.config.streams_show_title !== undefined ? this.config.streams_show_title : true;
            const config_streams_show_user_name = this.config.streams_show_user_name !== undefined ? this.config.streams_show_user_name : true;
            const config_streams_show_viewers = this.config.streams_show_viewers !== undefined ? this.config.streams_show_viewers : true;
            const config_streams_show_vips_ontop = this.config.streams_show_vips_ontop !== undefined ? this.config.streams_show_vips_ontop : true;
            
            const config_streams_spacing_horivontal = this.config.streams_spacing_horivontal !== undefined ? this.config.streams_spacing_horivontal : "1em";
            const config_streams_spacing_vertical = this.config.streams_spacing_vertical !== undefined ? this.config.streams_spacing_vertical : "1em";
            
            const config_streams_title_height = this.config.streams_title_height !== undefined ? this.config.streams_title_height : "1.2em";
            const config_streams_viewers_visibility_percentage = this.config.streams_viewers_visibility_percentage !== undefined ? this.config.streams_viewers_visibility_percentage : "100%";
            const config_streams_vip = this.config.streams_vip !== undefined ? this.config.streams_vip : [];


            let previousStreamCount = -1;
            let previousStreamDatas = [];
            let currentUser = null;

            // ### Functions
            // ##################################################
            async function main()
            {
                checkRequiredProperties();
                const streams = getStreams();

                if(streams.length == previousStreamCount && config_streams_reduce_requests) {
                    return;
                }
                printHeader(streams.length);

                const streamDatas = sortStreams(streams);
                await printStreams(streamDatas);
                previousStreamCount = streams.length;
                previousStreamDatas = streamDatas;
            }

            // ### Local Helpers
            function checkRequiredProperties() {
                if(!hass.config.components.includes("twitch")) {
                    console.error("Missing integration: https://www.home-assistant.io/integrations/twitch/ or as button: https://my.home-assistant.io/redirect/config_flow_start?domain=twitch");
                }
            }

            function getStreams() {
                const entityKeys = [];
                Object.keys(hass.entities).forEach(x => {
                    if(hass.entities[x].platform === 'twitch') {
                        entityKeys.push(hass.entities[x].entity_id);
                    }
                });

                const entitiesAll = [];
                Object.keys(hass.states).forEach(x => {
                    if(entityKeys.includes(x)) {
                        entitiesAll.push(hass.states[x]);
                    }
                });

                const entitiesOnline = [];
                entitiesAll.forEach(x => {
                    if(x.state === "streaming" ) {
                        entitiesOnline.push(x);
                    }
                });

                return entitiesOnline;
            }


            function printHeader(streamsCount) {
                if(config_global_show_header) {
                    const streamsCountDivH = document.createElement('h1');
                    streamsCountDivH.classList.add("card-header");
                    streamsCountDivH.style.paddingTop = "0.8em";
                    streamsCountDivH.innerText = streamsCount + " streams live";
                    streamsCountDiv.innerHTML = streamsCountDivH.outerHTML;
                    content.innerHTML = streamsCountDiv.outerHTML;
                }
            }

            function sortStreams(streams) {
                let vipStreamDatas = [];
                let standardStreamDatas = [];
                let skipped = 0;
                let sortedStreamDatas = [];

                streams.forEach((stream, index, arr) => {
                    const streamData = getDataAsStreamData(stream);

                    if(config_streams_vip.length > 0 && config_streams_show_vips_ontop && config_streams_vip.some((x) => x.toString().toLowerCase() == streamData.userDisplayName.toLowerCase())) {
                        streamData.isVip = true;
                        vipStreamDatas.push(streamData);
                        return;
                    }

                    if(config_streams_hide.length > 0 && config_streams_hide.some((x) => x.toString().toLowerCase() == streamData.userDisplayName.toLowerCase())) {
                        skipped++;
                        return;
                    }

                    standardStreamDatas.push(streamData);
                });

                log(skipped + " twitch streams hidden due to the 'streams_hide' setting");
                vipStreamDatas = sortStreamsByViewerCount(vipStreamDatas);
                standardStreamDatas = sortStreamsByViewerCount(standardStreamDatas);
                sortedStreamDatas = vipStreamDatas.concat(standardStreamDatas);
                log("Sorted streams");
                if(config_global_debug) console.log(sortedStreamDatas);
                return sortedStreamDatas;
            }

            function getDataAsStreamData(stream) {
                const streamData = new StreamData;

                streamData.isVip = false;
                streamData.userDisplayName = stream.attributes.friendly_name;

                streamData.streamGameName = stream.attributes.game;
                streamData.streamImage = stream.attributes.entity_picture.replace("24x24.jpg","300x400.jpg");
                streamData.streamViewerCount = stream.attributes.views;
                streamData.streamTitle = stream.attributes.title;

                return streamData;
            }

            function sortStreamsByViewerCount(streamDatas) {
                return streamDatas.sort(function(a, b) {
                    return a.streamViewerCount - b.streamViewerCount;
                  });
            }

            async function printStreams(streamDatas) {
                const streamsTable = document.createElement('table');
                for (let i = 0; i < streamDatas.length && i < config_streams_limit_count; i++) {
                    const streamData = streamDatas[i];
                    const streamContent = await printStream(streamData);
                    streamsTable.innerHTML += streamContent;
                }

                streamsDiv.innerHTML = streamsTable.outerHTML;
                content.innerHTML += streamsDiv.outerHTML;
            }

            async function printStream(streamData) {
                const streamContainerTr = document.createElement('tr');
                if(!config_streams_disable_click_to_view) {
                    streamContainerTr.setAttribute("onClick", "window.open('https://www.twitch.tv/" + streamData.userDisplayName + "')");
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
                    streamImageTdImg.setAttribute("src", streamData.streamImage);
                    
                    streamImageTd.innerHTML = streamImageTdImg.outerHTML;
                    streamContainerTr.innerHTML += streamImageTd.outerHTML;
                }
                
                // Details
                const streamDetailsTd = document.createElement('td');
                streamDetailsTd.style.marginLeft = "0.5em";
                streamDetailsTd.style.marginTop = "0.5em";
                streamDetailsTd.style.paddingBottom = config_streams_spacing_vertical;

                if(config_streams_show_game) {
                    let streamDetailsGameNameDiv = document.createElement("div");
                    streamDetailsGameNameDiv.style.fontSize = config_streams_font_size_game;
                    streamDetailsGameNameDiv.innerText = streamData.streamGameName;
                    streamDetailsTd.innerHTML += streamDetailsGameNameDiv.outerHTML;
                }

                if(config_streams_show_user_name) {
                    let streamDetailsUserNameDiv = document.createElement("div");
                    streamDetailsUserNameDiv.style.fontWeight = "bold";
                    streamDetailsUserNameDiv.style.fontSize = config_streams_font_size_user_name;

                    if(streamData.isVip) {
                        let streamDetailsUserNameDivVipSpan = document.createElement("span");
                        streamDetailsUserNameDivVipSpan.innerHTML = "✭&nbsp;";
                        streamDetailsUserNameDivVipSpan.style.color = getColorFromTemplate("--primary-color");
                        streamDetailsUserNameDiv.innerHTML = streamDetailsUserNameDivVipSpan.outerHTML;
                    }

                    let streamDetailsUserNameDivUserNameSpan = document.createElement("span");
                    streamDetailsUserNameDivUserNameSpan.innerText = streamData.userDisplayName;
                    streamDetailsUserNameDiv.innerHTML += streamDetailsUserNameDivUserNameSpan.outerHTML;

                    streamDetailsTd.innerHTML += streamDetailsUserNameDiv.outerHTML;
                }

                if(config_streams_show_viewers) {
                    const streamDetailsViewerCountDiv = document.createElement("div");
                    streamDetailsViewerCountDiv.style.fontSize = config_streams_font_size_viewers;
    
                    const streamDetailsViewerCountDivIconSpan = document.createElement("span");
                    streamDetailsViewerCountDivIconSpan.style.color = "red";
                    streamDetailsViewerCountDivIconSpan.style.fontWeight = "bold";
                    streamDetailsViewerCountDivIconSpan.innerHTML = "●&nbsp;";
                    streamDetailsViewerCountDiv.innerHTML += streamDetailsViewerCountDivIconSpan.outerHTML;
    
                    const streamDetailsViewerCountDivCountSpan = document.createElement("span");
                    streamDetailsViewerCountDivCountSpan.innerHTML = dimTextAsSpan(streamData.streamViewerCount + " viewers", config_streams_viewers_visibility_percentage);
                    streamDetailsViewerCountDiv.innerHTML += streamDetailsViewerCountDivCountSpan.outerHTML;
                    streamDetailsTd.innerHTML += streamDetailsViewerCountDiv.outerHTML;
                }

                if(config_streams_show_title) {
                    const streamDetailsTitleDiv = document.createElement("div");
                    streamDetailsTitleDiv.style.height = config_streams_title_height;
                    streamDetailsTitleDiv.style.fontSize = config_streams_font_size_title;
                    streamDetailsTitleDiv.style.overflow = "hidden";
                    streamDetailsTitleDiv.innerText = streamData.streamTitle;
                    streamDetailsTd.innerHTML += streamDetailsTitleDiv.outerHTML;
                }

                streamContainerTr.innerHTML += streamDetailsTd.outerHTML;

                return streamContainerTr.outerHTML;
            }

            function dimColor(foregroundColor, backgroundColor, visibilityPercentage) {
                return "color-mix(in srgb, " + foregroundColor + " " + visibilityPercentage + ", " + backgroundColor + ")";
            }

            function dimTextAsSpan(str, visibilityPercentage) {
                const dimTextSpan = document.createElement("span");
                const foregroundColor = getColorFromTemplate("--primary-text-color");
                const backgroundColor = getColorFromTemplate("--primary-background-color");
                dimTextSpan.innerHTML = str;
                dimTextSpan.style.color = dimColor(foregroundColor, backgroundColor, visibilityPercentage);
                return dimTextSpan.outerHTML;
            }
            
            function getColorFromTemplate(varName) {
                return getComputedStyle(document.documentElement).getPropertyValue(varName);
            }

            function log(str) {
                if(config_global_debug) console.log("TwitchFollowedLiveStreamsCard: " + str);
            }

            function printLoading() {
                const loadingDiv = document.createElement('div');
                loadingDiv.innerHTML = "Loading twitch streams...";
                loadingDiv.style.padding = "1em";
                content.innerHTML = loadingDiv.outerHTML;
            }

            async function init() {
                log("Loading streams...");
                printLoading();
                main();
                if(!config_streams_disable_auto_refresh) {
                    setInterval(async () => {
                        log("Reloading streams...");
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

class StreamData {
    isVip;
    userDisplayName;

    streamGameName;
    streamTitle;
    streamViewerCount;
    streamImage;
}

/*
# CONFIG

GLOBAL
global_debug
global_update_interval_s
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
streams_show_viewers_visibility_percentage
streams_show_vips_ontop
streams_spacing_horivontal
streams_spacing_vertical
streams_title_height
streams_vip
*/
