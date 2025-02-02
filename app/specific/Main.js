/*
 * Copyright (c) 2017-2020 Felipe de Leon <fglfgl27@gmail.com>
 *
 * This file is part of SmartTwitchTV <https://github.com/fgl27/SmartTwitchTV>
 *
 * SmartTwitchTV is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SmartTwitchTV is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with SmartTwitchTV.  If not, see <https://github.com/fgl27/SmartTwitchTV/blob/master/LICENSE>.
 *
 */

//Variable initialization
var smartTwitchTV;
var Main_isTV;
var Main_isDebug = false;

var Main_cursorYAddFocus = -1;

var Main_Search = 0;
var Main_Live = 1;
var Main_Users = 2;
var Main_Featured = 3;
var Main_games = 4;
var Main_Vod = 5;
var Main_Clip = 6;
var Main_UserLive = 7;
var Main_usergames = 8;
var Main_UserVod = 9;
var Main_UserChannels = 10;
var Main_SearchGames = 11;
var Main_SearchLive = 12;
var Main_SearchChannels = 13;
var Main_ChannelContent = 14;
var Main_ChannelVod = 15;
var Main_ChannelClip = 16;
var Main_addUser = 17;
var Main_aGame = 18;
var Main_AGameVod = 19;
var Main_AGameClip = 20;
var Main_HistoryLive = 21;
var Main_HistoryVod = 22;
var Main_HistoryClip = 23;

var Main_History = [Main_HistoryLive, Main_HistoryVod, Main_HistoryClip];
var Main_HistoryPos = 0;

var Main_GoBefore = '';
var Main_values = {
    "Main_Go": 1,
    "Main_Before": 1,
    "Main_BeforeSearch": 1,
    "Main_BeforeChannel": 1,
    "Main_BeforeAgame": Main_games,
    "Main_BeforeChannelisSet": false,
    "Main_BeforeAgameisSet": false,
    "Main_selectedChannel": '',
    "Main_selectedChannelDisplayname": '',
    "Main_selectedChannelLogo": '',
    "Main_selectedChannel_id": '',
    "Main_gameSelected": '',
    "Main_gameSelected_id": '',
    "Main_OldgameSelected": null,
    "Play_isHost": false,
    "Users_AddcodePosition": 0,
    "Play_WasPlaying": 0,
    "ChannelVod_vodId": '',
    "Search_data": '',
    "gameSelectedOld": null,
    "Games_return": false,
    "Search_isSearching": false,
    "Play_ChatForceDisable": false,
    "Never_run_new": true,
    "Chat_font_size_new": 75,
    "ChatBackground": 12,
    "Main_selectedChannelPartner": false,
    "Sidepannel_IsUser": false,
    "My_channel": false,
    "DeviceCheck2": false,
    "MiboxRevertCheck": false,
    "Never_run_phone": true,
    "Codec_is_Check": false,
    "OS_is_Check": false,
    "Restore_Backup_Check": false,
    "UserSidePannel_LastPositionId": null,
    "UserSidePannel_LastPosition": 0,
    "UserLiveFeed_LastPositionId": [],
    "UserLiveFeed_LastPosition": [],
    "IsUpDating": false,
    "WasLangChanged": false,
    "firebaseId": null,
};

var Main_VideoSizeAll = ["384x216", "512x288", "640x360", "896x504", "1280x720"];
var Main_GameSizeAll = ["179x250", "272x380", "340x475", "476x665", "773x1080"];
var Main_SidePannelSizeAll = ["640x360", "896x504", "1280x720", "1536x864", "1920x1080"];
var Main_SidePannelSize = "1280x720";
var Main_VideoSize = "640x360";
var Main_GameSize = "340x475";

var Main_values_Play_data;
var Main_values_History_data = {};//The obj is defined in AddUser_RestoreUsers()
var Main_LastClickFinish = true;
var Main_newUsercode = 0;
var Main_ExitCursor = 0;
var Main_ExitDialogID = null;
var Main_IsDayFirst = false;
var Main_SearchInput;
var Main_AddUserInput;
var Main_ChatLiveInput;
var Main_updateclockId;
var Main_ContentLang = "";
var Main_Periods = [];
var Main_addFocusVideoOffset = 0;
var Main_FirstRun = true;
var Main_FirstLoad = false;
var Main_RunningTime = 0;
var Main_PreventCheckResume = false;

var Main_base_string_header;
var Main_base_array_header;
var Main_Headers = [];
var Main_Headers_Backup = [];
var Main_kraken_api = 'https://api.twitch.tv/kraken/';
var Main_Authorization = 'Authorization';
var Main_OAuth = 'OAuth ';
var Main_TwithcV5Flag = '&api_version=5';
var Main_TwithcV5Flag_I = '?api_version=5';

var Main_classThumb = 'stream_thumbnail_focused';
var Main_DataAttribute = 'data-array';

var Main_update_show_toast = false;
var Main_IsOn_OSInterfaceVersion = '';
var Main_ClockOffset = 0;
var Main_IsOn_OSInterface = 0;
var Main_randomimg = '?' + Math.random();
var Main_DoRestore = true;
var Main_CanBackup = false;
var Main_UserBackupFile = 'user.json';
var Main_HistoryBackupFile = 'history.json';
var Main_Scene1Doc;
var Main_Scene2Doc;
var Main_vodOffset = 0;
var Main_body = document.body;
//Variable initialization end

// this function call will be used only when running the app/ folder, release maker will remove this
Main_Start();

function Main_Start() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            Main_StartApp();
        });
    } else { // `DOMContentLoaded` already fired
        Main_StartApp();
    }
}

function Main_StartApp() {
    Main_Checktylesheet();

    Main_ready(function() {

        try {
            if (Main_A_includes_B(window.location.href, 'asset')) {
                //Same as in smartTwitchTV/release/api.js
                //The app is running from assets need to expose smartTwitchTV
                smartTwitchTV = {
                    'mainstart': Main_Start,
                    'Play_PannelEndStart': Play_PannelEndStart,
                    'Play_PlayerCheck': Play_PlayerCheck,
                    'Play_UpdateDuration': Play_UpdateDuration,
                    'PlayExtra_End': PlayExtra_End,
                    'Play_MultiEnd': Play_MultiEnd,
                    'Play_CheckIfIsLiveClean': Play_CheckIfIsLiveClean,
                    'UserLiveFeed_CheckIfIsLiveResult': UserLiveFeed_CheckIfIsLiveResult,
                    'Sidepannel_CheckIfIsLiveResult': Sidepannel_CheckIfIsLiveResult,
                    'Main_CheckStop': Main_CheckStop,
                    'Main_CheckResume': Main_CheckResume,
                    'Play_getQualities': Play_getQualities,
                    'Play_ShowVideoStatus': Play_ShowVideoStatus,
                    'Play_ShowVideoQuality': Play_ShowVideoQuality,
                    'Play_PlayPauseChange': Play_PlayPauseChange,
                    'PlayVod_loadDataResult': PlayVod_loadDataResult,
                    'PlayExtra_ResumeResult': PlayExtra_ResumeResult,
                    'Play_loadDataResult': Play_loadDataResult,
                    'PlayClip_CheckIfIsLiveResult': PlayClip_CheckIfIsLiveResult,
                    'PlayVod_CheckIfIsLiveResult': PlayVod_CheckIfIsLiveResult,
                    'Play_MultiResult': Play_MultiResult,
                    'Screens_LoadPreviewResult': Screens_LoadPreviewResult,
                    'ChannelContent_LoadPreviewResult': ChannelContent_LoadPreviewResult,
                    'Play_StayCheckLiveResult': Play_StayCheckLiveResult,
                    'Play_CheckIfIsLiveResult': Play_CheckIfIsLiveResult,
                    'Play_ClipCheckIfIsLiveEnd': Play_ClipCheckIfIsLiveEnd,
                    'Main_onNewIntent': Main_onNewIntent,
                    'Main_EventChannelRefresh': Main_EventChannelRefresh,
                    'ChatLive_SetLatency': ChatLive_SetLatency,
                    'Main_CheckBasexmlHttpGet': Main_CheckBasexmlHttpGet,
                    'AddCode_refreshTokensResult': AddCode_refreshTokensResult,
                    'Main_CheckFullxmlHttpGet': Main_CheckFullxmlHttpGet
                };
            }

            Main_IsOn_OSInterfaceVersion = OSInterface_getversion();
            Main_isDebug = OSInterface_getdebug();
            Main_IsOn_OSInterface = Main_IsOn_OSInterfaceVersion !== '';

            OSInterface_setAppIds(AddCode_clientId, AddCode_client_secret, AddCode_redirect_uri);
            OSInterface_SetStreamDataHeaders(Play_Headers);

        } catch (e) {
            Main_IsOn_OSInterfaceVersion = version.VersionBase + '.' + version.publishVersionCode;
            Main_IsOn_OSInterface = 0;
            Main_body.style.backgroundColor = "rgba(155, 155, 155, 1)";//default rgba(0, 0, 0, 1)
            Main_isDebug = true;
            //Main_Log('Main_isDebug: ' + Main_isDebug);
            //Main_Log('Main_isBrowser: ' + !Main_IsOn_OSInterface);
            //If we add the class on the android app for some reason it prevents input from release the focus
            Main_AddClass('scenefeed', 'feed_screen_input');
            //When esc is clicked from android app a duple KEYCODE_BACK is send... prevent it
            KEY_RETURN = 27;
            Main_HideElement('scene_keys');

            Main_getElementById('scene2').style.pointerEvents = 'none';
            Main_getElementById('scene_channel_panel').style.pointerEvents = 'none';

        }

        Main_showLoadDialog();

        Main_initClick();
        Settings_SetDefautls();
        calculateFontSize();
        Main_RestoreValues();
        Settings_RestoreAppLang();

        DefaultLang();

        //When running locally from a browser overwrite AddCode_redirect_uri to be able to add authorization keys
        if (!Main_IsOn_OSInterface && !Main_A_includes_B(window.location.href, AddCode_redirect_uri)) {
            AddCode_redirect_uri = window.location.href.split('?code')[0];
        }

        if (Main_A_includes_B(window.location.href, 'code')) processCode(window.location.href);

        Main_Scene1Doc = Main_getElementById('scene1');
        Main_Scene2Doc = Main_getElementById('scene2');
        Sidepannel_FixDiv = Main_getElementById('side_panel_fix');
        Sidepannel_MovelDiv = Main_getElementById('side_panel_movel');

        Main_DoRestore = AddUser_RestoreUsers();

        if (!Main_values.Restore_Backup_Check) {

            try {
                OSInterface_requestWr();
                Main_HideLoadDialog();
                Main_innerHTML("main_dialog_remove", STR_BACKUP);
                Main_textContent('remove_cancel', STR_NO);
                Main_textContent('remove_yes', STR_YES);
                Main_ShowElement('main_yes_no_dialog');
                Main_values.Restore_Backup_Check = true;
                Main_PreventCheckResume = true;
                Main_addEventListener("keydown", Main_BackupDialodKeyDown);
            } catch (e) {
                Main_ready(Main_initWindows);
                return;
            }
        } else Main_ready(Main_initWindows);
    });

}

function Main_initClick() {
    if (Main_IsOn_OSInterface) {
        Main_isTV = OSInterface_deviceIsTV();
        //Only show virtual d-pad on none TV devices
        if (Main_isTV) return;
    } else return;

    Main_body.onpointerup = function() {
        OSInterface_initbodyClickSet();
    };
    OSInterface_initbodyClickSet();
}

function Main_BackupDialodKeyDown(event) {
    switch (event.keyCode) {
        case KEY_LEFT:
            Users_RemoveCursor--;
            if (Users_RemoveCursor < 0) Users_RemoveCursor = 1;
            Users_RemoveCursorSet();
            break;
        case KEY_RIGHT:
            Users_RemoveCursor++;
            if (Users_RemoveCursor > 1) Users_RemoveCursor = 0;
            Users_RemoveCursorSet();
            break;
        case KEY_ENTER:
            Main_PreventCheckResume = false;
            Main_showLoadDialog();
            Main_HideElement('main_yes_no_dialog');
            Main_removeEventListener("keydown", Main_BackupDialodKeyDown);
            if (Users_RemoveCursor && !Main_DoRestore) Main_initRestoreBackups();
            else Main_initWindows();
            break;
        default:
            break;
    }
}

function Main_initRestoreBackups() {
    try {

        if (OSInterface_HasBackupFile(Main_UserBackupFile)) {

            var tempBackup = OSInterface_RestoreBackupFile(Main_UserBackupFile);

            if (tempBackup !== null) {
                var tempBackupArray = JSON.parse(tempBackup) || [];

                if (Array.isArray(tempBackupArray) && tempBackupArray.length > 0) {
                    Main_setItem('AddUser_UsernameArray', tempBackup);

                    tempBackup = OSInterface_RestoreBackupFile(Main_HistoryBackupFile);
                    var tempBackupObj = JSON.parse(tempBackup) || {};

                    if (tempBackup !== null && tempBackupObj instanceof Object) Main_setItem('Main_values_History_data', tempBackup);

                    AddUser_RestoreUsers();
                    if (AddUser_UserIsSet()) OSInterface_mCheckRefresh();
                }
            }

        }

        Main_initWindows();
    } catch (e) {
        Main_initWindows();
    }
}

function Main_initWindows() {
    //Main_Log('Main_initWindows');
    Main_CheckBackup();

    Users_RemoveCursor = 0;
    Users_RemoveCursorSet();
    Main_CheckDevice();

    Main_Setworker();
    Main_SetStringsMain();

    Main_GoBefore = Main_values.Main_Go;

    Chat_Preinit();
    Play_PreStart();
    UserLiveFeed_Prepare();

    Screens_InitScreens();

    if (AddUser_UserIsSet()) {
        Main_CheckResumeFeedId = Main_setTimeout(Main_updateUserFeed, 10000, Main_CheckResumeFeedId);
    }

    Main_SetUpdateclock();
    Main_StartHistoryworkerId = Main_setInterval(Main_StartHistoryworker, (1000 * 60 * 3), Main_StartHistoryworkerId);//Check it 3 min
    Main_SetHistoryworker();
    Main_CheckResumeVodsId = Main_setTimeout(Main_StartHistoryworker, 20000, Main_CheckResumeVodsId);
    Main_checkWebVersionId = Main_setInterval(Main_CheckUpdate, (1000 * 60 * 30), Main_checkWebVersionId);//Check it 60 min

    Main_setTimeout(Main_RunVODWorker, 50000);
    Main_setInterval(Main_RunVODWorker, (1000 * 60 * 360));//Check it 6 hours

    Main_setTimeout(Main_RunClipWorker, 80000);
    Main_setInterval(Main_RunClipWorker, (1000 * 60 * 370));//Check it 6 hours

    Main_setTimeout(AddUser_UpdateUserAllUsers, 30000);

    Main_SetStringsSecondary();
    Main_checkVersion();

    Main_SearchInput = Main_getElementById("search_input");
    Main_AddUserInput = Main_getElementById("user_input");
    Main_ChatLiveInput = Main_getElementById("chat_send_input");

}

function Main_CheckBackup() {

    if (Main_IsOn_OSInterface) {
        Main_CanBackup = OSInterface_canBackupFile();

        //Backup at start as a backup may never be done yet
        if (Main_CanBackup && AddUser_IsUserSet()) {

            Main_setTimeout(
                function() {
                    OSInterface_BackupFile(Main_UserBackupFile, JSON.stringify(AddUser_UsernameArray));
                },
                10000
            );

        }
    } else Main_CanBackup = false;

}

function Main_CheckDevice() {

    if (Main_IsOn_OSInterface) {

        var device;

        if (!Main_values.DeviceCheck2) {

            Main_values.DeviceCheck2 = true;
            Main_values.MiboxRevertCheck = true;

            device = OSInterface_getDevice();
            var Manufacturer = OSInterface_getManufacturer();

            device = device ? device.toLowerCase() : "";
            Manufacturer = Manufacturer ? Manufacturer.toLowerCase() : "";

            if (Main_A_includes_B(device, 'shield android tv') ||
                Main_A_includes_B(Manufacturer, 'nvidia')) {
                //Some devices are very slow and are affected by some app default setting Nvidia shield is not

                //bitrate to max possible
                Settings_value.bitrate_min.defaultValue = 0;
                Main_setItem('bitrate_min', 1);

                Settings_value.res_min.defaultValue = 0;
                Main_setItem('res_min', 1);
                OSInterface_SetSmallPlayerBitrate(0, 0);

                //enable small player over feed on multi
                Settings_value.disable_feed_player_multi.defaultValue = 0;
                Main_setItem('disable_feed_player_multi', 1);

                //Enable app animations
                Settings_ForceEnableAnimations();
            }

        } else if (!Main_values.MiboxRevertCheck) {

            Main_values.MiboxRevertCheck = true;
            device = OSInterface_getDevice();
            device = device ? device.toLowerCase() : "";

            if (Main_A_includes_B(device, 'mibox4')) {//revert enable workaround by default

                Settings_value.block_qualities_9.defaultValue = 0;
                Main_setItem('block_qualities_9', 1);

                Settings_QualitiesCheck();
            }

        }

        //Disable googles OMX.google.h264.decoder if another codec is available
        //Check if at least one none google codec is available
        if (!Main_values.Codec_is_Check) {
            var getcodec = null;
            try {
                if (Main_IsOn_OSInterface) getcodec = JSON.parse(OSInterface_getcodecCapabilities('avc'));
            } catch (e) { }

            if (getcodec) {

                Main_values.Codec_is_Check = true;

                if (getcodec.length > 1) {
                    var codecsnames = [];

                    var i = 0, len = getcodec.length;
                    for (i; i < len; i++) {

                        if (Main_A_includes_B(getcodec[i].name ? getcodec[i].name.toLowerCase() : "", 'google'))
                            codecsnames.push(getcodec[i].name);

                    }

                    if (codecsnames.length === 1) {

                        Main_setItem(codecsnames[0], 1);
                        Main_setItem('Settings_DisableCodecsNames', JSON.stringify(codecsnames));

                        OSInterface_setBlackListMediaCodec(codecsnames.join());

                    }
                }

            }

        }

    }// else Settings_ForceEnableAnimations();
}

function Main_SetStringsMain() {

    //set top bar labels
    Main_IconLoad('label_refresh', 'icon-refresh', STR_REFRESH + ":" + STR_GUIDE);

    Main_IconLoad('label_thumb', 'icon-options', STR_THUMB_OPTIONS_TOP);
    UserLiveFeed_SetFeedPicText();

    Sidepannel_SetDefaultLables();

    Main_textContent("dialog_end_next_text", STR_PLAY_NEXT);
    Main_textContent("dialog_end_replay_text", STR_REPLAY);
    Main_textContent("dialog_end_vod_text", STR_OPEN_BROADCAST);
    Main_textContent("dialog_end_channel_text", STR_CHANNEL_CONT);
    Main_textContent("dialog_end_game_text", STR_GAME_CONT);

    Main_Periods = [STR_CLIP_DAY, STR_CLIP_WEEK, STR_CLIP_MONTH, STR_CLIP_ALL];

    Settings_SetSettings();
    Main_Changelog();
}

function Main_SetStringsSecondary() {
    Main_textContent("play_dialog_exit_text", STR_EXIT_AGAIN);

    Main_textContent('side_panel_feed_settings', STR_SIDE_PANEL_SETTINGS);

    Main_textContent('chanel_button', STR_CHANNELS);
    Main_textContent('game_button', STR_GAMES);
    Main_textContent('live_button', STR_LIVE);
    Main_textContent('exit_app_cancel', STR_CANCEL);
    Main_textContent('exit_app_close', STR_CLOSE);
    Main_textContent('remove_cancel', STR_CANCEL);
    Main_textContent('remove_yes', STR_YES);
    Main_textContent('exit_app_minimize', STR_MINIMIZE);
    Main_textContent("main_dialog_exit_text", STR_EXIT_MESSAGE);

    Main_innerHTML("dialog_controls_text", STR_CONTROLS_MAIN_0);
    Main_textContent('side_panel_warn_text', STR_NO + STR_LIVE_CHANNELS);
    Main_textContent('side_panel_movel_top_text', STR_LIVE_FEED);

    Main_textContent("dialog_period_text", STR_SWITCH_CLIP);
    Main_innerHTML("dialog_period_1", Main_Periods[0]);
    Main_innerHTML("dialog_period_2", Main_Periods[1]);
    Main_innerHTML("dialog_period_3", Main_Periods[2]);
    Main_innerHTML("dialog_period_4", Main_Periods[3]);

    Main_innerHTML("main_dialog_user_first", STR_USER_MAKE_ONE);
    Main_innerHTML("main_dialog_user_remove", STR_USER_REMOVE);

    Main_innerHTML("dialog_OffSet_text", STR_SWITCH_POS + STR_BR);
    Main_textContent("dialog_OffSet_text_summary", STR_SWITCH_POS_SUMMARY);

    Main_innerHTML("dialog_vod_start_text", STR_FROM_START);

    Main_innerHTML('channel_content_titley_0', '<i class="icon-movie-play stream_channel_follow_icon"></i>' + STR_SPACE_HTML + STR_SPACE_HTML + STR_VIDEOS);
    Main_innerHTML('channel_content_titley_1', '<i class="icon-movie stream_channel_follow_icon"></i>' + STR_SPACE_HTML + STR_SPACE_HTML + STR_CLIPS);
    Main_innerHTML('channel_content_titley_2', '<i class="icon-heart-o" style="color: #FFFFFF; font-size: 100%; "></i>' + STR_SPACE_HTML + STR_SPACE_HTML + STR_FOLLOW);

    Main_textContent("dialog_hist_setting_name_0", STR_SORTING);
    Main_textContent("dialog_hist_setting_name_1", STR_ENABLED);
    Main_textContent("dialog_hist_setting_name_2", STR_DELETE_HISTORY);
    Main_textContent("dialog_hist_setting_name_3", STR_DELETE_UNREACHABLE);
    Main_textContent("dialog_hist_setting_summary_3", STR_DELETE_UNREACHABLE_SUMMARY);
    Main_textContent('dialog_hist_val_2', STR_PRESS_ENTER_D);
    Main_textContent('dialog_hist_text_end', STR_PRESS_ENTER_APPLY);

    Main_textContent('dialog_opt_text', STR_THUMB_OPTIONS);
    Main_textContent('dialog_opt_text_end', STR_THUMB_OPTIONS_KEY);

    Main_textContent('dialog_thumb_opt_setting_name_-1', STR_DELETE_FROM_HISTORY);
    Main_textContent('dialog_thumb_opt_val_-1', STR_PRESS_ENTER_D);

    Main_textContent('dialog_thumb_opt_setting_name_0', STR_OPEN_CHANNEL);
    Main_textContent('dialog_thumb_opt_setting_name_1', STR_OPEN_GAME);
    Main_textContent('dialog_thumb_opt_setting_name_3', STR_HISTORY_LIVE_DIS);
    Main_textContent('dialog_thumb_opt_setting_name_4', STR_CONTENT_LANG);
    Main_textContent('dialog_thumb_opt_setting_name_5', STR_GO_TO);

    Main_innerHTML("dialog_multi_help_text", STR_CONTROLS_MULTI);

    Main_textContent("chat_send_button0", STR_OPTIONS);
    Main_textContent("chat_send_button1", STR_CHAT_DELL_ALL);
    Main_textContent("chat_send_button2", STR_CHAT_UNICODE_EMOJI);
    Main_textContent("chat_send_button3", STR_CHAT_BTTV_GLOBAL);
    Main_textContent("chat_send_button4", STR_CHAT_FFZ_GLOBAL);
    Main_textContent("chat_send_button5", STR_CHAT_SEVENTV_GLOBAL);
    Main_textContent("chat_send_button6", STR_CHAT_SEND);
    Main_textContent("chat_send_button7", STR_CHAT_AT_STREAM);
    Main_textContent("chat_send_button8", STR_CHAT_TW_EMOTES);
    Main_textContent("chat_send_button9", STR_CHAT_BTTV_STREAM);
    Main_textContent("chat_send_button10", STR_CHAT_FFZ_STREAM);
    Main_textContent("chat_send_button11", STR_CHAT_SEVENTV_STREAM);
    Main_textContent("chat_result", STR_CHAT_RESULT);
    ChatLiveControls_OptionsUpdate_defautls();

    Main_textContent("update_dialog_changebutton", STR_FULL_CHANGELOG);
    Main_textContent("update_dialog_exit", STR_CLOSE_THIS2);

    Main_innerHTML('feed_end_1', STR_FEATURED);
    Main_innerHTML('feed_end_3', STR_LIVE);
    Main_innerHTML('feed_end_4', STR_USER + STR_SPACE_HTML + STR_LIVE);
    Main_innerHTML('feed_end_5', STR_LIVE + STR_SPACE_HTML + STR_HISTORY);
    Main_innerHTML('feed_end_7', STR_USER + STR_SPACE_HTML + 'VOD');
    Main_innerHTML('feed_end_8', 'VOD ' + STR_HISTORY);
    Main_innerHTML('icon_feed_back', STR_SPACE_HTML);
}

function Main_IconLoad(lable, icon, string) {
    Main_innerHTML(lable, '<div style="vertical-align: middle; display: inline-block; transform: translateY(15%);"><i class="' + icon + '" style="color: #FFFFFF;"></i></div><div style="vertical-align: middle; display: inline-block; transform: translateY(10%);">' + STR_SPACE_HTML + string + '</div>');
}

function Main_HideElement(element) {
    Main_HideElementWithEle(Main_getElementById(element));
}

function Main_HideElementWithEle(element) {
    element.classList.add('hide');
}

function Main_ShowElement(element) {
    Main_ShowElementWithEle(Main_getElementById(element));
}

function Main_ShowElementWithEle(element) {
    element.classList.remove('hide');
}

function Main_isElementShowing(element) {
    return Main_isElementShowingWithEle(Main_getElementById(element));
}

function Main_isElementShowingWithEle(element) {
    return !Main_A_includes_B(element.className, 'hide');
}

function Main_AddClass(element, mclass) {
    Main_AddClassWitEle(Main_getElementById(element), mclass);
}

function Main_AddClassWitEle(element, mclass) {
    element.classList.add(mclass);
}

function Main_RemoveClass(element, mclass) {
    Main_RemoveClassWithEle(Main_getElementById(element), mclass);
}

function Main_RemoveClassWithEle(element, mclass) {
    element.classList.remove(mclass);
}

function Main_innerHTML(div, value) {
    Main_innerHTMLWithEle(Main_getElementById(div), value);
}

function Main_innerHTMLWithEle(ele, value) {
    ele.innerHTML = value;
}

function Main_textContent(div, value) {
    Main_textContentWithEle(Main_getElementById(div), value);
}

function Main_textContentWithEle(ele, value) {
    ele.textContent = value;
}

function Main_RemoveElement(ele) {
    if (ele) ele.remove();
}

function Main_replaceClassEmoji(div) {
    var emojiel = Main_getElementById(div).getElementsByClassName("emoji");
    if (emojiel) {

        var i = 0, len = emojiel.length;
        for (i; i < len; i++)
            emojiel[i].classList.add('emoticon');

        emojiel = Main_getElementById(div).getElementsByClassName("emoticon");
        i = 0;
        len = emojiel.length;
        for (i; i < len; i++)
            emojiel[i].classList.remove('emoji');
    }
}

function Main_showLoadDialog() {
    Main_YRst(-1);
    if (Main_IsOn_OSInterface) OSInterface_mshowLoading(true);
    else Main_ShowElement('dialog_loading');
}

function Main_HideLoadDialog() {
    if (Main_IsOn_OSInterface) OSInterface_mshowLoading(false);
    else Main_HideElement('dialog_loading');
}

function Main_clearExitDialog() {
    Main_clearTimeout(Main_ExitDialogID);
}

function Main_setExitDialog() {
    Main_ExitDialogID = Main_setTimeout(Main_HideExitDialog, 6000, Main_ExitDialogID);
}

function Main_showExitDialog() {
    Main_setExitDialog();
    Main_ShowElement('main_dialog_exit');
    Main_addEventListener("keydown", Main_ExitDialog);
}

function Main_HideExitDialog() {
    Main_removeEventListener("keydown", Main_ExitDialog);
    Main_SwitchScreen();
    Main_clearExitDialog();
    Main_HideElement('main_dialog_exit');
    Main_ExitCursor = 0;
    Main_ExitCursorSet();
}

function Main_ExitCursorSet() {
    Main_RemoveClass('exit_app_cancel', 'button_dialog_focused');
    Main_RemoveClass('exit_app_minimize', 'button_dialog_focused');
    Main_RemoveClass('exit_app_close', 'button_dialog_focused');
    if (!Main_ExitCursor) Main_AddClass('exit_app_cancel', 'button_dialog_focused');
    else if (Main_ExitCursor === 1) Main_AddClass('exit_app_minimize', 'button_dialog_focused');
    else Main_AddClass('exit_app_close', 'button_dialog_focused');
}

function Main_isExitDialogVisible() {
    return Main_isElementShowing('main_dialog_exit');
}

function Main_CounterDialogRst() {
    Main_empty('dialog_counter_text');
}

function Main_CounterDialog(x, y, coloumns, total) {
    if (total > 0) Main_textContent('dialog_counter_text', (y * coloumns) + (x + 1) + '/' + (total));
    else Main_CounterDialogRst();
}

var Main_showWarningDialogId;
function Main_showWarningDialog(text, timeout, changePos) {
    var doc = Main_getElementById('dialog_warning');

    if (changePos) doc.style.marginTop = '86vh';
    else doc.style.marginTop = '50vh';

    Main_innerHTML('dialog_warning_text', text);
    Main_ShowElementWithEle(doc);

    if (timeout) Main_showWarningDialogId = Main_setTimeout(Main_HideWarningDialog, timeout, Main_showWarningDialogId);
}

function Main_HideWarningDialog() {
    Main_HideElement('dialog_warning');
}

function Main_AboutDialogUpdateTime() {
    Main_innerHTML('about_runningtime', STR_RUNNINGTIME + STR_SPACE_HTML + Play_timeDay((new Date().getTime()) - Main_RunningTime));
}

function Main_showAboutDialog(removeEventListener, addEventListener) {
    Main_removeEventListener("keydown", removeEventListener);
    Main_addEventListener("keydown", addEventListener);

    Main_AddClass('dialog_changelod_text', 'hideimp');
    Main_RemoveClass('dialog_about_text', 'hideimp');

    Main_HideControlsDialog();
    Main_AboutDialogUpdateTime();
    Main_ShowElement('dialog_about');
    Main_EventScreen('About');
}

function Main_HideAboutDialog() {
    Main_HideElement('dialog_about');
}

function Main_isAboutDialogVisible() {
    return Main_isElementShowing('dialog_about');
}

function Main_showSettings() {
    Main_HideControlsDialog();
    Main_HideWarningDialog();
    Main_ExitCurrent(Main_values.Main_Go);
    Main_CounterDialogRst();
    Settings_init();
}

function Main_showWelcomeDialog(removeEventListener, addEventListener) {
    Main_removeEventListener("keydown", removeEventListener);
    Main_addEventListener("keydown", addEventListener);

    var phone_warning = '';
    if (!Main_isTV) {

        phone_warning = STR_DIV_TITLE + STR_WARNING_PHONE + '</div>' + STR_BR + STR_WARNING_PHONE_SUMMARY + STR_BR + STR_BR;

    }

    Main_innerHTML(
        "welcome_dialog_text",
        STR_DIV_TITLE + STR_WELCOME + STR_SPACE_HTML + STR_TWITCH_TV + '</div>' + STR_BR +
        STR_ABOUT_INFO_1 + STR_BR + STR_BR +
        STR_ABOUT_INFO_2 + STR_BR + STR_BR +
        STR_WELCOME_SUMMARY + STR_BR + STR_BR +
        STR_CONTACT +
        phone_warning +
        STR_DIV_TITLE + STR_CLOSE_THIS + '</div>'
    );

    Main_ShowElement('welcome_dialog');

}

function Main_HideWelcomeDialog() {
    Main_HideElement('welcome_dialog');
}

function Main_isWelcomeDialogVisible() {
    return Main_isElementShowing('welcome_dialog');
}

function Main_showControlsDialog(removeEventListener, addEventListener) {
    Main_removeEventListener("keydown", removeEventListener);
    Main_addEventListener("keydown", addEventListener);
    Main_HideAboutDialog();
    Main_ShowElement('dialog_controls');
    Main_EventScreen('Controls');
}

function Main_HideControlsDialog() {
    Main_HideElement('dialog_controls');
}

function Main_isControlsDialogVisible() {
    return Main_isElementShowing('dialog_controls');
}

function Main_addCommas(value) {
    if (!value) return value;
    return (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Main_videoqualitylang(video_height, average_fps, language) {
    video_height = video_height + ''; //stringfy doesnot work 8|
    if (!video_height.indexOf('x')) video_height = video_height.slice(-3);

    average_fps = Main_Calculatefps(average_fps);

    return video_height + 'p' + average_fps + ((language !== "") ? ' [' + language.toUpperCase() + ']' : '');
}

function Main_Calculatefps(fps) {
    if (fps > 58) return 60;
    else if (fps < 32) return 30;

    return Math.ceil(fps);
}

function Main_is_rerun(content) {
    return !Main_A_includes_B(content + '', 'live');
}

function Main_ThumbNull(y, x, thumbnail) {
    return Main_getElementById(thumbnail + y + '_' + x) !== null;
}

function Main_ReStartScreens(preventRefresh) {
    if (Sidepannel_isShowingUserLive()) {
        Main_addEventListener("keydown", Sidepannel_handleKeyDown);
        if (!Sidepannel_PlayerViewSidePanelSet) Sidepannel_SetPlayerViewSidePanel();
        if (Play_PreviewId) OSInterface_SidePanelPlayerRestore();
        Sidepannel_AddFocusLiveFeed(true);
    } else Main_SwitchScreen(false, preventRefresh);
}

function Main_SwitchScreen(removekey, preventRefresh) {
    //Main_Log('Main_SwitchScreen removekey ' + removekey + ' Main_Go ' + Main_values.Main_Go);

    Main_HideWarningDialog();
    if (Main_values.Main_Go !== Main_ChannelContent) Main_values.Main_BeforeChannelisSet = false;
    if (Main_values.Main_Go !== Main_aGame) Main_values.Main_BeforeAgameisSet = false;

    Main_CounterDialogRst();

    if (ScreenObj[Main_values.Main_Go]) ScreenObj[Main_values.Main_Go].init_fun(preventRefresh);
    else ScreenObj[1].init_fun();

    if (removekey) Main_removeEventListener("keydown", ScreenObj[Main_values.Main_Go].key_fun);
}

function Main_OpenSearch() {
    if (!Main_values.Search_isSearching) Main_values.Main_BeforeSearch = Main_values.Main_Go;
    Main_ExitCurrent(Main_values.Main_Go);
    Main_values.Main_Go = Main_Search;
    Main_HideWarningDialog();
    Main_CounterDialogRst();
    Search_init();
}

var Main_SaveValuesWithTimeoutId;
function Main_SaveValuesWithTimeout() {
    Main_SaveValuesWithTimeoutId = Main_setTimeout(
        Main_SaveValues,
        500,
        Main_SaveValuesWithTimeoutId
    );
}

function Main_SaveValues() {
    Main_setItem('Main_values', JSON.stringify(Main_values));
    Main_setItem('Play_data', JSON.stringify(Play_data));
}

function Main_RestoreValues() {
    Main_values = Screens_assign(Main_values, Main_getItemJson('Main_values', {}));
    Play_data = Screens_assign(Play_data, Main_getItemJson('Play_data', {}));
}

function Main_ExitCurrent(ExitCurrent) {
    //Main_Log('Main_ExitCurrent ' + ExitCurrent);
    if (ScreenObj[ExitCurrent].exit_fun) ScreenObj[ExitCurrent].exit_fun();
    if (Main_isElementShowing('settings_holder')) Settings_exit();
}

function Main_RestoreTopLabel() {
    Main_IconLoad('label_refresh', 'icon-refresh', STR_REFRESH + ":" + STR_GUIDE);
    Main_IconLoad('label_thumb', 'icon-options', STR_THUMB_OPTIONS_TOP);
}

function Main_cleanTopLabel() {
    Main_IconLoad('label_thumb', 'icon-return', STR_GOBACK);
}

function Main_videoCreatedAt(time) { //time in '2017-10-27T13:27:27Z' or ms
    time = new Date(time);
    if (Main_IsDayFirst) return time.getDate() + ' ' + STR_MONTHS[time.getMonth()] + ' ' + time.getFullYear();
    else return STR_MONTHS[time.getMonth()] + ' ' + time.getDate() + ' ' + time.getFullYear();
}

//WithHM = with hour minutes
function Main_videoCreatedAtWithHM(time) { //time in '2017-10-27T13:27:27Z' or ms
    var result = Main_videoCreatedAt(time);
    time = new Date(time);
    return result + ' ' + time.getHours() + ":" + Play_lessthanten(time.getMinutes());
}

function Main_checkVersion(skipCheck) {
    var Main_versionTag;

    if (Main_IsOn_OSInterface) {

        var device = OSInterface_getDevice();
        var Webviewversion = OSInterface_getWebviewVersion();
        var Manufacturer = OSInterface_getManufacturer();
        var Main_AndroidSDK = OSInterface_getSDK();

        Main_Log('Webviewversion ' + Webviewversion);

        Main_versionTag = "Apk: " + Main_IsOn_OSInterfaceVersion + ' Web: ' + version.WebVersion +
            (Webviewversion ? (' Webview: ' + Webviewversion) : '') + ' Device: ' + Manufacturer + ' - ' + device +
            ' Sdk: ' + Main_AndroidSDK;

        var needUpdate = Main_needUpdate(Main_IsOn_OSInterfaceVersion);

        if (!Settings_value.update_background.defaultValue) {

            if (needUpdate) {

                Main_HasUpdate = true;
                Main_WarnUpdate(false);

            } else if (!skipCheck) Main_CheckUpdate();

        }

        Main_EventVersion(
            Main_IsOn_OSInterfaceVersion,
            version.WebVersion,
            Webviewversion,
            device,
            Main_AndroidSDK,
            Manufacturer
        );

    } else {

        Main_versionTag = version.VersionBase + '.' + version.publishVersionCode + ' - ' + version.WebVersion;

        Main_EventVersion(
            Main_IsOn_OSInterfaceVersion,
            version.WebVersion,
            navigator.appVersion,
            navigator.platform,
            'Browser',
            'Browser'
        );
        //To test the position
        Main_WarnUpdate(true, true);
    }

    Main_innerHTML("dialog_about_text", STR_ABOUT_INFO_HEADER + Main_versionTag + STR_BR +
        '<span id="about_runningtime"></span>' + STR_ABOUT_INFO_0);

    Main_RunningTime = new Date().getTime();
}

var Main_checkWebVersionId;
var Main_checkWebVersionResumeId;
var Main_HasUpdate;
var Main_Ischecking;
function Main_CheckUpdate(forceUpdate) {

    if (Main_HasUpdate && Main_isUpdateDialogVisible() &&
        Settings_value.update_background.defaultValue && !forceUpdate) return;

    if (Main_IsOn_OSInterface) {

        BaseXmlHttpGet(
            'https://fgl27.github.io/SmartTwitchTV/release/githubio/version/version.json',
            0,
            null,
            Main_CheckUpdateResult,
            Main_CheckUpdateFail,
            0,
            0
        );

    }

}

function Main_CheckUpdateFail() {

    if (Main_isUpdateDialogVisible()) {

        OSInterface_showToast(STR_UPDATE_CHECKING_FAIL);

    }

}

var Main_IsWebupdate;
function Main_CheckUpdateResult(responseText) {
    Main_Ischecking = false;
    Main_UpdateDialogLastCheck = Main_getclock();

    var response = JSON.parse(responseText),
        webupdate = response.WebTag > version.WebTag,
        apkupdate = response.publishVersionCode > version.publishVersionCode;

    if (webupdate || apkupdate) {
        Main_HasUpdate = true;

        version.changelog = JSON.parse(JSON.stringify(response.changelog));
        version.ApkUrl = response.ApkUrl;
        Main_IsWebupdate = !apkupdate && webupdate;

        Main_WarnUpdate(Main_IsWebupdate);

    } else if (Main_isUpdateDialogVisible()) {

        Main_UpdateDialogTitle();
        OSInterface_showToast(STR_NO_UPDATES);

    }

    Main_UpdateDialogSetTitle();
}

function Main_WarnUpdate(web, skipShowUpdateDialog) {
    Main_innerHTML(
        'label_update',
        '<div style="vertical-align: middle; display: inline-block;"><i class="icon-' +
        (web ? 'globe' : 'play-1') +
        '" style="color: #FF2828;"></i></div><div style="vertical-align: middle; display: inline-block; color: #FF2828">' + STR_SPACE_HTML +
        (web ? STR_WEB_UPDATE_AVAILABLE : STR_UPDATE_AVAILABLE) + STR_UPDATE_CHECK_SIDE + '</div>'
    );

    Main_ShowElement('label_update');

    if (Main_isUpdateDialogVisible()) {

        Main_UpdateDialogTitle();

    } else if (!Settings_value.update_show.defaultValue && !skipShowUpdateDialog) {

        Main_showUpdateDialog();

    } else if (!Main_update_show_toast && Settings_value.update_show.defaultValue === 1) {

        OSInterface_showToast((web ? STR_WEB_UPDATE_AVAILABLE : STR_UPDATE_AVAILABLE) + STR_UPDATE_CHECK_SIDE);
        Main_update_show_toast = true;

    }

}

function Main_needUpdate(check_version) {

    var versionArray = check_version.split("."),
        MajorVersion = versionArray[0] + '.' + versionArray[1],
        MinVersion = parseInt(versionArray[2]),
        needUpdate = (parseFloat(MajorVersion) < parseFloat(version.VersionBase)) ||
            (MinVersion < version.publishVersionCode);

    //Update so futures updates checks work
    version.VersionBase = MajorVersion;
    version.publishVersionCode = MinVersion;

    return needUpdate;
}

function Main_UpdateDialogSet() {

    if (!Main_Ischecking) Main_UpdateDialogSetTitle();
    Main_RemoveClass('update_dialog_upbutton', 'button_dialog_focused');
    Main_RemoveClass('update_dialog_changebutton', 'button_dialog_focused');
    Main_AddClass(!Main_UpdateCursor ? 'update_dialog_upbutton' : 'update_dialog_changebutton', 'button_dialog_focused');

}

function Main_UpdateDialogSetTitle() {

    Main_getElementById('update_dialog_upbutton').style.width = !Main_HasUpdate ? "30%" : "23%";
    Main_innerHTML("update_dialog_upbutton", Main_HasUpdate ? STR_UPDATE : STR_UPDATE_CHECK);

}

var Main_ChangeDialogVisible;
function Main_isChangeDialogVisible() {
    return Main_ChangeDialogVisible;
}

function Main_showChangelogDialog() {
    Main_AddClass('dialog_about_text', 'hideimp');
    Main_RemoveClass('dialog_changelod_text', 'hideimp');

    Main_ChangeDialogVisible = true;
    Main_ShowElement('dialog_about');
    Main_EventScreen('Changelog');
}

function Main_HideChangeDialog() {
    Main_HideElement('dialog_about');
    Main_ChangeDialogVisible = false;
}

var Main_UpdateCursor = 0;
function Main_UpdateDialogKeyFun(event) {
    event.stopPropagation();

    switch (event.keyCode) {
        case KEY_KEYBOARD_BACKSPACE:
        case KEY_RETURN:
            if (Main_isAboutDialogVisible()) {

                Main_HideChangeDialog();
                Main_showUpdateDialog();

            } else {

                Main_HideUpdateDialog();

            }

            break;
        case KEY_RIGHT:
        case KEY_LEFT:
            Main_UpdateCursor = Main_UpdateCursor ^ 1;
            Main_UpdateDialogSet();
            break;
        case KEY_ENTER:

            if (Main_isAboutDialogVisible()) {

                Main_HideChangeDialog();
                Main_HideUpdateDialog();

            } else if (Main_UpdateCursor) {

                Main_HideUpdateDialog(true);
                Main_showChangelogDialog();

            } else {

                if (Main_HasUpdate) {

                    Main_values.IsUpDating = true;
                    Main_SaveValues();

                    if (Main_IsWebupdate) {

                        Main_HideElement('update_dialog');
                        Main_showLoadDialog();
                        Main_SaveHistoryItem();
                        OSInterface_stopVideo();
                        Main_hideScene1Doc();
                        Main_hideScene2Doc();

                        //delay to make sure all was saved OK
                        Main_setTimeout(
                            function() {

                                OSInterface_CleanAndLoadUrl(OSInterface_mPageUrl());

                            },
                            250
                        );

                    } else {

                        Main_showLoadDialog();
                        var fromPlay = OSInterface_getInstallFromPLay();

                        OSInterface_showToast(fromPlay ? STR_UPDATE_PLAY : STR_UPDATE_START);

                        OSInterface_UpdateAPK(
                            fromPlay ? null : version.ApkUrl,
                            STR_UPDATE_FAIL,
                            STR_UPDATE_FAIL_DOWNLOAD
                        );

                    }


                } else {

                    if (Main_Ischecking) return;
                    Main_UpdateDialogStartCheck();

                }

            }

            break;
        default:
            break;
    }
}

var Main_UpdateDialogLastCheck;
function Main_UpdateDialogTitle() {

    var innerHtml = '<div class="about_text_title" ' + (Main_HasUpdate ? ' style="color: #FF0000;"' : '') + '>' +
        (Main_HasUpdate ? (Main_IsWebupdate ? STR_WEB_UPDATE_AVAILABLE : STR_UPDATE_AVAILABLE) : STR_UPDATE_CHANGELOG) + STR_BR +
        (!Main_HasUpdate && Main_UpdateDialogLastCheck ? STR_UPDATE_LAST_CHECK + Main_UpdateDialogLastCheck : STR_SPACE_HTML) + '</div>' + STR_BR +
        STR_DIV_TITLE + STR_UPDATE_LATEST + STR_SPACE_HTML + '</div>' + STR_BR,
        changelog = version.changelog;

    innerHtml += STR_DIV_TITLE + changelog[0].title + '</div>' + STR_BR + STR_DIV_MIDLE_LEFT;

    var len = changelog[0].changes.length,
        i = 0;

    for (i; i < len; i++) {
        innerHtml += STR_DOT + changelog[0].changes[i] + STR_BR;
    }
    innerHtml += '</div>';

    Main_innerHTML(
        'update_dialog_text',
        innerHtml
    );

}

function Main_UpdateDialogShowCheck() {

    Main_UpdateDialogStartCheck();
    Main_showUpdateDialog();

}

function Main_UpdateDialogStartCheck() {

    Main_Ischecking = true;
    Main_getElementById('update_dialog_upbutton').style.width = "30%";
    Main_innerHTML("update_dialog_upbutton", STR_UPDATE_CHECKING);
    Main_CheckUpdate(true);

}

function Main_showUpdateDialog() {
    Main_UpdateDialogTitle();
    Main_PreventClick(true, Main_UpdateDialogKeyFun, true);
    Main_UpdateDialogSet();

    //Clear preveiw as it is on top of the view
    if (Sidepannel_isShowingUserLive()) {

        Sidepannel_RemoveFocusFeed();
        Sidepannel_UpdateThumbDiv();

    } else if (UserLiveFeed_isPreviewShowing() && Main_isScene2DocVisible()) UserLiveFeed_FeedRemoveFocus(UserLiveFeed_FeedPosX);
    else if (Screens_Isfocused()) Screens_RemoveFocus(Main_values.Main_Go);

    Main_ShowElement('update_dialog');
    Main_UpdateDialogVisible = true;

    Main_EventScreen('UpdateDialog');
}

function Main_HideUpdateDialog(preventFocus) {

    Main_UpdateCursor = 0;
    Main_HideElement('update_dialog');
    Main_UpdateDialogVisible = false;

    if (preventFocus) return;

    Main_PreventClick(false, Main_UpdateDialogKeyFun);

    if (Sidepannel_isShowingUserLive()) {

        Sidepannel_AddFocusLiveFeed(true);

    } else if (UserLiveFeed_isPreviewShowing()) {

        UserLiveFeed_FeedAddFocus(true, UserLiveFeed_FeedPosX);

    } else if (Main_isScene1DocVisible() && !Sidepannel_isShowingMenus()) {

        if (ScreenObj[Main_values.Main_Go].addFocus) Screens_addFocus(true, Main_values.Main_Go);
        else ScreenObj[Main_values.Main_Go].init_fun();

    }

}

var Main_UpdateDialogVisible;
function Main_isUpdateDialogVisible() {
    return Main_UpdateDialogVisible;
}

function Main_Changelog() {

    var STR_CHANGELOG_LINK = "https://tinyurl.com/sttvchanges",
        innerHtml = STR_DIV_TITLE + STR_CHANGELOG + '</div>' + STR_CHANGELOG_SUMMARY +
            STR_DIV_LINK + STR_CHANGELOG_LINK + '</div><br><br>',
        changelog = version.changelog;

    var i = 0; var len = changelog.length, j, lenj;

    for (i; i < len; i++) {

        innerHtml += STR_DIV_TITLE + changelog[i].title + '</div>' + STR_DIV_MIDLE_LEFT;

        lenj = changelog[i].changes.length;

        for (j = 0; j < lenj; j++) {
            innerHtml += STR_DOT + changelog[i].changes[j] + STR_BR;
        }
        innerHtml += '</div><br>';
    }

    Main_innerHTML("dialog_changelod_text", innerHtml + STR_DIV_TITLE + STR_CLOSE_THIS3 + '</div></div>');
}

function Main_empty(el) {
    Main_emptyWithEle(Main_getElementById(el));
}

function Main_emptyWithEle(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
}

function Main_YRst(y) {
    Main_cursorYAddFocus = y;
}

function Main_YchangeAddFocus(y) {
    var position = 0;

    if (Main_cursorYAddFocus < y) position = -1; //going down
    else if (Main_cursorYAddFocus > y) position = 1; //going up

    Main_cursorYAddFocus = y;
    return position;
}

//"keyClickDelay, keyClickDelayStart and Main_CantClick" are here to prevent races during click and hold
//That can cause visual glitches and make the user lost sense on were the focus is
//Or cause the app to keep moving up/down seconds after the key has be released
function Main_keyClickDelay() {
    Main_LastClickFinish = true;
}

function Main_keyClickDelayStart() {
    Main_LastClickFinish = false;
    Main_setTimeout(Main_keyClickDelay);
}

function Main_CantClick() {
    return !Main_LastClickFinish;
}

function Main_ThumbOpenIsNull(id, thumbnail) {
    return Main_getElementById(thumbnail + id) === null;
}

function Main_OpenLiveStream(data, id, idsArray, handleKeyDownFunction, checkHistory, screen) {
    if (Main_ThumbOpenIsNull(id, idsArray[0])) return;
    var isHosting = false;

    Main_removeEventListener("keydown", handleKeyDownFunction);
    Main_values_Play_data = data;
    Play_data.data = Main_values_Play_data;

    if (checkHistory) {

        var index = Main_history_Exist('live', Main_values_Play_data[7]);

        if (index > -1) {

            if (Main_values_History_data[AddUser_UsernameArray[0].id].live[index].forceVod) {

                Main_OPenAsVod(index);
                return;

            } else {//is live check if is the same BroadcastID

                if (!Play_PreviewId && Main_values_History_data[AddUser_UsernameArray[0].id].live[index].vodid) Main_CheckBroadcastID(index, idsArray[2] + id);
                else {

                    Main_EventPlay(
                        'live',
                        Main_values_Play_data[6],
                        Main_values_Play_data[3],
                        Main_values_Play_data[15],
                        screen
                    );

                    Main_openStream();
                }


                return;
            }

        }
    }

    isHosting = Main_A_includes_B(Play_data.data[1], STR_USER_HOSTING);
    Main_values.Play_isHost = isHosting;

    if (Main_values.Play_isHost) {
        Play_data.DisplaynameHost = Play_data.data[1];
        Play_data.data[1] = Play_data.data[15];
    }

    if (Main_values.Main_Go === Main_aGame) Main_values.Main_OldgameSelected = Main_values.Main_gameSelected;

    Main_openStream();

    Main_EventPlay(
        'live',
        Main_values_Play_data[6],
        Main_values_Play_data[3],
        !isHosting ? Main_values_Play_data[15] : 'HOSTING',
        screen
    );
}

var Main_CheckBroadcastIDex;
var Main_CheckBroadcastIDoc;

function Main_CheckBroadcastID(index, doc) {
    Main_CheckBroadcastIDex = index;
    Main_CheckBroadcastIDoc = doc;
    Main_CheckBroadcastIDStart();
}

function Main_CheckBroadcastIDStart() {
    var theUrl = Main_kraken_api + 'streams/' + Play_data.data[14] + Main_TwithcV5Flag_I;
    BaseXmlHttpGet(
        theUrl,
        2,
        null,
        Main_CheckBroadcastIDStartSucess,
        Main_openStream,
        false
    );
}

function Main_CheckBroadcastIDStartSucess(response) {
    response = JSON.parse(response);
    if (response.stream !== null) {
        if (Main_values_Play_data[7] === response.stream._id) {
            Main_openStream();
            return;
        }
    }

    //force set as vod and set the div
    Main_values_History_data[AddUser_UsernameArray[0].id].live[Main_CheckBroadcastIDex] = Screens_assign(
        Main_values_History_data[AddUser_UsernameArray[0].id].live[Main_CheckBroadcastIDex],
        {
            forceVod: true
        }
    );

    var doc = Main_getElementById(Main_CheckBroadcastIDoc);
    doc.childNodes[0].classList.add('hideimp');
    doc.childNodes[2].classList.remove('hideimp');

    Main_OPenAsVod(Main_CheckBroadcastIDex);
}

function Main_getElementById(elemString) {
    return document.getElementById(elemString);
}

function Main_isScene1DocVisible() {
    return parseInt(Main_Scene1Doc.style.opacity);
}

function Main_showScene1Doc() {
    Main_Scene1Doc.style.opacity = 1;

    if (!Main_IsOn_OSInterface) {
        Main_Scene1Doc.style.pointerEvents = '';
    }
}

function Main_hideScene1Doc() {
    Main_Scene1Doc.style.opacity = 0;

    if (!Main_IsOn_OSInterface) {
        Main_Scene1Doc.style.pointerEvents = 'none';
    }
}

var Main_hideScene1DocAndCallBackId;
function Main_hideScene1DocAndCallBack(callback) {

    Main_hideScene1Doc();

    //Delay the the call back as it depedes from the Main_Scene1Doc not be visible anymore
    Main_hideScene1DocAndCallBackId = Main_ready(function() {
        Main_setTimeout(callback, 100, Main_hideScene1DocAndCallBackId);
    });

}

function Main_showScene2Doc() {
    Main_Scene2Doc.style.opacity = 1;

    if (!Main_IsOn_OSInterface) {
        Main_Scene2Doc.style.pointerEvents = '';
    }
}

function Main_hideScene2Doc() {
    Main_Scene2Doc.style.opacity = 0;

    if (!Main_IsOn_OSInterface) {
        Main_Scene2Doc.style.pointerEvents = 'none';
    }

}

function Main_isScene2DocVisible() {
    return parseInt(Main_Scene2Doc.style.opacity);
}

function Main_OPenAsVod(index) {
    if (!Main_values_History_data[AddUser_UsernameArray[0].id].live[index].vodid) {
        Main_openStream();
        return;
    }

    Main_values.Main_selectedChannelDisplayname = Main_values_Play_data[1];
    Main_values.Main_selectedChannel = Main_values_Play_data[6];
    Main_values.Main_selectedChannelLogo = Main_values_Play_data[9];
    Main_values.Main_selectedChannelPartner = Main_values_Play_data[10];
    Main_values.Main_selectedChannel_id = Main_values_Play_data[14];
    Play_DurationSeconds = 0;

    Main_values.ChannelVod_vodId = Main_values_History_data[AddUser_UsernameArray[0].id].live[index].vodid;
    Main_vodOffset =
        ((Main_values_History_data[AddUser_UsernameArray[0].id].live[index].date - (new Date(Main_values_Play_data[12]).getTime())) / 1000);

    if (Main_vodOffset < 0) Main_vodOffset = 1;

    if (Play_isOn) {
        Main_OPenAsVod_shutdownStream();
    }

    if (!Play_PreviewId) Play_showWarningDialog(STR_LIVE_VOD + Play_timeMs(Main_vodOffset * 1000));
    Main_openVod();

    Main_setTimeout(
        function() {
            if (!Play_IsWarning) Play_HideWarningDialog();
        },
        3000
    );
}

function Main_OPenAsVod_shutdownStream() {
    Main_OPenAsVod_PreshutdownStream(true);
    Play_data.qualities = [];
    Main_values.Play_WasPlaying = 0;
    UserLiveFeed_PreventHide = false;
}

function Main_OPenAsVod_PreshutdownStream() {
    if (Main_IsOn_OSInterface) {
        OSInterface_stopVideo();
    }

    Play_isOn = false;
    if (Play_MultiEnable) Play_controls[Play_MultiStream].enterKey(false);

    if (!Play_isEndDialogVisible() || true) UserLiveFeed_Hide();

    Play_ClearPlay(true);
    Play_ClearPlayer();
}

function Main_openStream() {
    Main_hideScene1DocAndCallBack(
        function() {
            Main_showScene2Doc();
            Main_addEventListener("keydown", Play_handleKeyDown);
            if (!Play_EndDialogEnter) Play_HideEndDialog();
            Play_Start();
        }
    );
}

function Main_OpenClip(data, id, idsArray, handleKeyDownFunction, screen) {
    if (Main_ThumbOpenIsNull(id, idsArray[0])) return;

    Main_removeEventListener("keydown", handleKeyDownFunction);
    Main_RemoveClass(idsArray[1] + id, 'opacity_zero');

    Main_values_Play_data = data;

    ChannelClip_playUrl = Main_values_Play_data[0];
    Play_DurationSeconds = parseInt(Main_values_Play_data[1]);
    Main_values.Main_selectedChannel_id = Main_values_Play_data[2];

    Play_data.data[3] = Main_values_Play_data[3];
    if (Play_data.data[3] === null) Play_data.data[3] = "";
    ChannelClip_game = (Play_data.data[3] !== "" && Play_data.data[3] !== null ? STR_PLAYING + Play_data.data[3] : "");

    Main_values.Main_selectedChannelDisplayname = Main_values_Play_data[4];
    Main_values.Main_selectedChannelLogo = Main_values_Play_data[5];
    ChannelClip_Id = Main_values_Play_data[7];
    Main_values.Main_selectedChannel = Main_values_Play_data[6];
    Main_values.ChannelVod_vodId = Main_values_Play_data[8];
    ChannelVod_vodOffset = parseInt(Main_values_Play_data[9]);

    ChannelClip_title = Main_values_Play_data[10];
    ChannelClip_language = Main_values_Play_data[11];
    ChannelClip_createdAt = STR_CREATED_AT + Main_values_Play_data[16];
    ChannelClip_views = Main_values_Play_data[14] + STR_VIEWS;
    //ChannelClip_playUrl2 = Main_values_Play_data[15].split("-preview")[0] + ".mp4";

    Main_hideScene1DocAndCallBack(
        function() {
            Main_showScene2Doc();

            Main_addEventListener("keydown", PlayClip_handleKeyDown);
            PlayClip_Start();

            Main_EventPlay(
                'clip',
                Main_values_Play_data[6],
                Main_values_Play_data[3],
                Main_values_Play_data[17],
                screen
            );
        }
    );

}

function Main_OpenVodStart(data, id, idsArray, handleKeyDownFunction, screen) {
    if (Main_ThumbOpenIsNull(id, idsArray[0])) return;
    Main_removeEventListener("keydown", handleKeyDownFunction);
    Main_RemoveClass(idsArray[1] + id, 'opacity_zero');

    Main_values_Play_data = data;

    Main_values.Main_selectedChannelDisplayname = Main_values_Play_data[1];
    ChannelVod_createdAt = Main_values_Play_data[2];

    Play_data.data[3] = Main_values_Play_data[3];
    if (Play_data.data[3] === null) Play_data.data[3] = "";
    ChannelVod_game = (Play_data.data[3] !== "" && Play_data.data[3] !== null ? STR_STARTED + STR_PLAYING + Play_data.data[3] : "");

    ChannelVod_views = Main_values_Play_data[4];

    Main_values.Main_selectedChannel = Main_values_Play_data[6];
    Main_values.ChannelVod_vodId = Main_values_Play_data[7];

    ChannelVod_language = Main_values_Play_data[9];
    ChannelVod_title = Main_values_Play_data[10];
    Play_DurationSeconds = parseInt(Main_values_Play_data[11]);

    Main_values.Main_selectedChannel_id = Main_values_Play_data[14];
    Main_values.Main_selectedChannelLogo = Main_values_Play_data[15];
    Main_values.Main_selectedChannelPartner = Main_values_Play_data[16];

    Main_openVod();

    Main_EventPlay(
        'vod',
        Main_values_Play_data[6],
        Main_values_Play_data[3],
        Main_values_Play_data[9],
        screen
    );

}

function Main_openVod() {
    Main_hideScene1DocAndCallBack(
        function() {
            Main_showScene2Doc();

            Main_addEventListener("keydown", PlayVod_handleKeyDown);
            Play_hideChat();
            PlayVod_Start();
        }
    );
}

function Main_removeFocus(id, idArray) {
    Screens_LoadPreviewSTop();
    Main_HideWarningDialog();
    Main_RemoveClass(idArray[1] + id, 'opacity_zero');
    Main_RemoveClass(idArray[0] + id, Main_classThumb);
}

// stylesheet[i].cssRules or stylesheet[i].rules is blocked in chrome
// So in order to check if a css class is loaded one can check it's font-family
// The simple test here it to remove the <link rel="stylesheet" href="https://werevere"> from index and see if the bellow funtion loads the css for you and vice versa
function Main_Checktylesheet() {
    var span = document.createElement('span');

    span.className = 'fa';
    span.style.display = 'none';
    Main_body.insertBefore(span, Main_body.firstChild);

    Main_ready(function() {
        if (window.getComputedStyle(span, null).getPropertyValue('font-family') !== 'icons') {
            Main_Log('Main_Checktylesheet reloading');
            Main_LoadStylesheet('https://fgl27.github.io/SmartTwitchTV/release/githubio/css/icons.min.css');
        } else Main_Log('Main_Checktylesheet loaded OK');

        Main_body.removeChild(span);
    });
}

function Main_LoadStylesheet(path) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path;

    document.getElementsByTagName("head")[0].appendChild(link);
}

//adapted from https://code.jquery.com/jquery-3.3.1.js
function Main_ready(func) {
    if (document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll)) {

        // Handle it asynchronously to allow scripts the opportunity to delay ready
        Main_setTimeout(func);

    } else document.addEventListener("DOMContentLoaded", func);
}

var Main_SetUpdateclockId;
function Main_SetUpdateclock() {
    Main_updateclock();
    Main_clearInterval(Main_updateclockId);

    //sync with device clock
    var seconds = 61 - (new Date().getSeconds());
    Main_SetUpdateclockId = Main_setTimeout(
        function() {

            Main_updateclock();
            Main_updateclockId = Main_setInterval(Main_updateclock, 60000, Main_updateclockId);

        },
        seconds * 1000,
        Main_SetUpdateclockId
    );
}

function Main_updateclock() {
    var clock = Main_getclock();
    Main_textContent("stream_clock", clock);
    Main_textContent('label_clock', clock);

    Main_randomimg = '?' + parseInt(Math.random() * 100000);

    Screens_SetLastRefresh(Main_values.Main_Go);
    UserLiveFeedobj_SetLastRefresh(UserLiveFeed_FeedPosX);
    Sidepannel_SetLastRefresh();
}

var Main_clock_H_M = '';
var Main_date_Ms = 0;
function Main_getclock() {
    Main_date_Ms = new Date().getTime();

    var timems = Main_date_Ms + Main_ClockOffset,
        dayMonth,
        date = new Date(timems);

    if (Main_IsDayFirst) dayMonth = STR_DAYS[date.getDay()] + ' ' + date.getDate() + ' ' + STR_MONTHS[date.getMonth()];
    else dayMonth = STR_DAYS[date.getDay()] + ' ' + STR_MONTHS[date.getMonth()] + ' ' + date.getDate();

    Main_clock_H_M = Play_lessthanten(date.getHours()) + ':' + Play_lessthanten(date.getMinutes());

    return dayMonth + ' ' + Main_clock_H_M;
}

function Main_updateUserFeed() {
    //Main_Log('Main_updateUserFeed');

    if (AddUser_UserIsSet() && !UserLiveFeed_isPreviewShowing() &&
        !Sidepannel_isShowingUserLive() && !UserLiveFeed_loadingData[UserLiveFeedobj_UserLivePos]) {
        UserLiveFeed_RefreshLive();
        UserLiveFeedobj_LiveFeedOldUserName = AddUser_UsernameArray[0].name;
    }
}

function Main_ExitDialog(event) {
    switch (event.keyCode) {
        case KEY_KEYBOARD_BACKSPACE:
        case KEY_RETURN:
            Main_HideExitDialog();
            break;
        case KEY_RIGHT:
            Main_ExitCursor++;
            if (Main_ExitCursor > 2) Main_ExitCursor = 0;
            Main_ExitCursorSet();
            Main_clearExitDialog();
            Main_setExitDialog();
            break;
        case KEY_LEFT:
            Main_ExitCursor--;
            if (Main_ExitCursor < 0) Main_ExitCursor = 2;
            Main_ExitCursorSet();
            Main_clearExitDialog();
            Main_setExitDialog();
            break;
        case KEY_ENTER:
            if (!Main_IsOn_OSInterface || !Main_ExitCursor) Main_HideExitDialog();
            else if (Main_ExitCursor === 1) {
                Main_HideExitDialog();
                OSInterface_mclose(false);
            } else if (Main_ExitCursor === 2) OSInterface_mclose(true);
            break;
        default:
            break;
    }
}

function Main_ReloadScreen() {
    //Main_Log('Main_ReloadScreen ' + Main_values.Main_Go);
    Screens_clear = true;
    ChannelContent_clear = true;

    if (Main_values.Main_Go !== Main_ChannelContent) Main_values.Main_BeforeChannelisSet = false;
    if (Main_values.Main_Go !== Main_aGame) Main_values.Main_BeforeAgameisSet = false;

    Main_CounterDialogRst();

    ScreenObj[Main_values.Main_Go].isReloadScreen = true;
    ScreenObj[Main_values.Main_Go].start_fun();
}

function Main_setItem(item, value) {
    localStorage.setItem(item, value);
}

function Main_getItemInt(item, default_value) {
    var value = parseInt(localStorage.getItem(item));
    if (value || value === 0) return value;
    return default_value;
}

function Main_getItemString(item, default_value) {
    return localStorage.getItem(item) || default_value;
}

function Main_getItemJson(item, default_value) {
    return JSON.parse(localStorage.getItem(item)) || default_value;
}

function Main_getItemBool(item, default_value) {
    var default_string = default_value.toString();
    return (localStorage.getItem(item) || default_string) === default_string ? default_value : !default_value;
}

// use http://www.fileformat.info/info/unicode/char/16EB/index.html
// Replace "16EB" with is the char ᛫ by the result of "string.charCodeAt(i).toString(16).toUpperCase()"
// To see supported fonts and etc info about the unknown char
// function Main_PrintUnicode(string) { // jshint ignore:line
//     Main_Log(string);
//var i = 0, len = string.length;
//     for (i; i < len; i++) 
//         Main_Log('Character is: ' + string.charAt(i) + " it's Unicode is: \\u" + string.charCodeAt(i).toString(16).toUpperCase());
// }

function processCode(pageUrl) {
    //Main_Log("processCode");
    var code = '';
    code = pageUrl.match(/code=(\w+)/);
    if (code) {
        code = code[1];
        CheckPage("?code=" + code);
        //Main_Log('if code ' + code);
        Main_newUsercode = code;
    } else {
        //Main_Log('else code ' + code);
        CheckPage('');
        Main_newUsercode = 0;
    }
}

//Redirect to assets if running from it
function CheckPage(pageUrlCode) {
    if (Main_IsOn_OSInterface) {
        var PageUrl = OSInterface_mPageUrl();
        if (PageUrl) {
            if (!Main_A_includes_B(window.location.href, 'asset') && Main_A_includes_B(PageUrl, 'asset')) {
                OSInterface_mloadUrl(PageUrl + pageUrlCode);
                return;
            }
        }
    }
}

function BaseXmlHttpGet(theUrl, HeaderQuatity, access_token, callbackSucess, calbackError, key, checkResult) {

    if (Main_IsOn_OSInterface) {

        var JsonHeadersArray = !HeaderQuatity ? null : Main_base_string_header;

        if (HeaderQuatity && HeaderQuatity !== 2) {

            JsonHeadersArray = JSON.stringify(Main_GetHeader(HeaderQuatity, access_token));

        }

        OSInterface_BaseXmlHttpGet(
            theUrl,
            DefaultHttpGetTimeout,
            null,
            null,
            JsonHeadersArray,
            'Main_CheckBasexmlHttpGet',
            checkResult,
            key,
            callbackSucess.name,
            calbackError.name
        );

    } else {

        var xmlHttp = new XMLHttpRequest(),
            i = 0;

        xmlHttp.open("GET", theUrl, true);
        xmlHttp.timeout = DefaultHttpGetTimeout;

        if (access_token) Main_Headers[2][1] = access_token;

        for (i; i < HeaderQuatity; i++)
            xmlHttp.setRequestHeader(Main_Headers[i][0], Main_Headers[i][1]);

        xmlHttp.onreadystatechange = function() {

            if (this.readyState === 4) {

                Main_BasexmlHttpStatus(this, key, callbackSucess, calbackError, checkResult);

            }

        };

        xmlHttp.send(null);

    }

}

function Main_CheckBasexmlHttpGet(result, key, callbackSucess, calbackError, checkResult) {

    Main_BasexmlHttpStatus(
        JSON.parse(result),
        key,
        eval(callbackSucess),// jshint ignore:line
        eval(calbackError),// jshint ignore:line
        checkResult
    );

}

function Main_BasexmlHttpStatus(obj, key, callbackSucess, calbackError, checkResult) {

    if (obj.status === 200) {

        callbackSucess(obj.responseText, key, checkResult); // jshint ignore:line

        return;

    } else if (obj.status === 401 || obj.status === 403 &&
        (AddUser_UserIsSet() && AddUser_UsernameArray[0].access_token)) { //token expired

        AddCode_refreshTokens(0, null, null);

    }

    calbackError(key, checkResult); // jshint ignore:line

}

function Main_GetHeader(HeaderQuatity, access_token) {

    if (HeaderQuatity) {

        var array = [];
        if (access_token) Main_Headers[2][1] = access_token;

        for (var i = 0; i < HeaderQuatity; i++)
            array.push([Main_Headers[i][0], Main_Headers[i][1]]);

        return array;

    } else return [];

}

function FullxmlHttpGet(theUrl, Headers, callbackSucess, calbackError, key, checkResult, Method, postMessage) {

    if (Main_IsOn_OSInterface) {

        OSInterface_BaseXmlHttpGet(
            theUrl,
            DefaultHttpGetTimeout,
            postMessage,
            Method ? Method : null,
            Headers ? JSON.stringify(Headers) : null,
            'Main_CheckFullxmlHttpGet',
            checkResult,
            key,
            callbackSucess.name,
            calbackError.name
        );


    } else {

        var xmlHttp = new XMLHttpRequest();

        xmlHttp.open(Method ? Method : "GET", theUrl, true);
        xmlHttp.timeout = DefaultHttpGetTimeout;

        if (Headers) {

            var i = 0, len = Headers.length;

            for (i; i < len; i++)
                xmlHttp.setRequestHeader(Headers[i][0], Headers[i][1]);

        }

        xmlHttp.onreadystatechange = function() {

            if (this.readyState === 4) {

                callbackSucess(this, key, checkResult);

            }

        };

        xmlHttp.send(postMessage ? postMessage : null);

    }

}

function Main_CheckFullxmlHttpGet(result, key, callbackSucess, calbackError, checkResult) {

    eval(callbackSucess)(// jshint ignore:line
        JSON.parse(result),
        key,
        checkResult
        //eval(calbackError)// jshint ignore:line
    );

}

var Main_GetHostBaseUrl = '{"operationName":"UseHosting","variables":{"channelLogin":\"%x\"},"extensions":{"persistedQuery":{"version": 1,"sha256Hash":"427f55a3daca510f726c02695a898ef3a0de4355b39af328848876052ea6b337"}}}';
function Main_GetHost(callbackSucess, key, checkResult, channel) {

    FullxmlHttpGet(
        PlayClip_BaseUrl,
        Play_base_backup_headers_Array,
        callbackSucess,
        noop_fun,
        key,
        checkResult,
        'POST',//Method, null for get
        Main_GetHostBaseUrl.replace('%x', channel)//postMessage, null for get
    );

}

function Main_SetThumb() {
    Main_VideoSize = Main_VideoSizeAll[Settings_value.thumb_quality.defaultValue];
    Main_GameSize = Main_GameSizeAll[Settings_value.thumb_quality.defaultValue];
    Main_SidePannelSize = Main_SidePannelSizeAll[Settings_value.thumb_quality.defaultValue];
}

function Main_ReplaceLargeFont(text) {
    if (!text) return '';

    return text.replace(/[^\x00-\x7F]/g, function(match) {
        return '<span style="font-size: 0.8em;">' + match + '</span>';
    });
}

function Main_Set_history(type, Data, skipUpdateDate) {

    if (!AddUser_IsUserSet() || !Data || !Data[0] ||//Check is user is set, and data is valid
        (type === 'live' && ScreenObj[Main_HistoryLive].histPosX[1]) || //Check if the history for this type is enable
        (type === 'vod' && ScreenObj[Main_HistoryVod].histPosX[1]) ||
        (type === 'clip' && ScreenObj[Main_HistoryClip].histPosX[1])) {

        return;

    }

    var index = Main_history_Exist(type, Data[7]);

    if (index > -1) {

        var ArrayPos = Main_values_History_data[AddUser_UsernameArray[0].id][type][index];

        ArrayPos.data = Main_Slice(Data);
        ArrayPos.date = !skipUpdateDate ? new Date().getTime() : ArrayPos.date;
        ArrayPos.game = Data[3];
        ArrayPos.views = Data[13];

    } else {
        //Limit size to 2000
        if (Main_values_History_data[AddUser_UsernameArray[0].id][type].length > 1999) {

            //Sort by oldest first to delete the oldest
            Main_values_History_data[AddUser_UsernameArray[0].id][type].sort(
                function(a, b) {
                    return (a.date < b.date ? -1 : (a.date > b.date ? 1 : 0));
                }
            );

            if (type === 'vod' || type === 'clip') {

                Main_history_Watched_Obj[Main_values_History_data[AddUser_UsernameArray[0].id][type][0].data[7]] = 0;

            }

            Main_values_History_data[AddUser_UsernameArray[0].id][type].shift();

        }

        Main_values_History_data[AddUser_UsernameArray[0].id][type].push(
            {
                data: Main_Slice(Data),
                date: new Date().getTime(),
                name: Data[6] ? Data[6].toLowerCase() : "",
                game: Data[3],
                id: Data[7],
                views: Data[13],
                created_at: new Date(Data[12]).getTime(),
                watched: 0
            }
        );

        if (type === 'live') {
            //Sort live by id this allows to always show the newst first even by sorting by othrs tipe
            //this allows to get with are alredy VOD easier when there is more then one broadcast for the same streamer
            Main_values_History_data[AddUser_UsernameArray[0].id][type].sort(
                function(a, b) {
                    return (a.id > b.id ? -1 : (a.id < b.id ? 1 : 0));
                }
            );
        }

    }

    Main_setHistoryItem();

}

var Main_history_Watched_Obj = {};

function Main_history_SetVod_Watched() {
    Main_history_Watched_Obj = {};

    var array = Main_values_History_data[AddUser_UsernameArray[0].id].vod,
        i = 0, len = array.length;

    for (i; i < len; i++) {

        Main_history_Watched_Obj[array[i].data[7]] = (array[i].watched / array[i].data[11]) * 100;

    }

    array = Main_values_History_data[AddUser_UsernameArray[0].id].clip;
    i = 0;
    len = array.length;

    for (i; i < len; i++) {

        Main_history_Watched_Obj[array[i].data[7]] = (array[i].watched / array[i].data[1]) * 100;

    }
}

function Main_history_Exist(type, id) {

    var index = 0, len = Main_values_History_data[AddUser_UsernameArray[0].id][type].length;

    for (index; index < len; index++)
        if (Main_values_History_data[AddUser_UsernameArray[0].id][type][index].id === id) return index;

    return -1;
}

function Main_history_Find_Vod_In_Live(id) {
    var index = 0, len = Main_values_History_data[AddUser_UsernameArray[0].id].live.length;

    for (index; index < len; index++) {
        if (Main_values_History_data[AddUser_UsernameArray[0].id].live[index].forceVod &&
            Main_values_History_data[AddUser_UsernameArray[0].id].live[index].vodid === id) {
            return index;
        }
    }

    return -1;
}

function Main_history_UpdateLiveVod(id, vod, vod_img) {
    if (!AddUser_IsUserSet() || ScreenObj[Main_HistoryLive].histPosX[1]) return;

    var index = Main_history_Exist('live', id);

    if (index > -1) {

        var ArrayPos = Main_values_History_data[AddUser_UsernameArray[0].id].live[index];

        ArrayPos.vodid = vod;
        ArrayPos.vodimg = vod_img;

        Main_setHistoryItem();
    }
}

function Main_history_UpdateVodClip(id, time, type) {
    if (!AddUser_IsUserSet() || (type === 'vod' && ScreenObj[Main_HistoryVod].histPosX[1]) ||
        (type === 'clip' && ScreenObj[Main_HistoryClip].histPosX[1])) return;

    var index = Main_history_Exist(type, id);

    if (index > -1) {

        var ArrayPos = Main_values_History_data[AddUser_UsernameArray[0].id][type][index];

        ArrayPos.date = new Date().getTime();
        ArrayPos.watched = time;

        Main_history_Watched_Obj[ArrayPos.data[7]] = (time / (type === 'vod' ? ArrayPos.data[11] : ArrayPos.data[1])) * 100;

        Main_setHistoryItem();

    }
}

function Main_Restore_history() {
    Main_values_History_data = Screens_assign(Main_values_History_data, Main_getItemJson('Main_values_History_data', {}));
    Main_history_SetVod_Watched();
}

function Main_History_Sort(array, msort, direction) {

    if (direction) {//a-z
        array.sort(
            function(a, b) {
                return (a[msort] < b[msort] ? -1 : (a[msort] > b[msort] ? 1 : 0));
            }
        );
    } else {//z-a
        array.sort(
            function(a, b) {
                return (a[msort] > b[msort] ? -1 : (a[msort] < b[msort] ? 1 : 0));
            }
        );
    }
}

var Main_setHistoryItemId;
function Main_setHistoryItem() {
    Main_setHistoryItemId = Main_setTimeout(
        Main_SaveHistoryItem,
        10000,
        Main_setHistoryItemId
    );
}

function Main_SaveHistoryItem() {
    var string = JSON.stringify(Main_values_History_data);
    Main_setItem('Main_values_History_data', string);
    if (Main_CanBackup) OSInterface_BackupFile(Main_HistoryBackupFile, string);
}

//Only works on vectors, matrixs and etc need to use JSON.parse(JSON.stringify(array)) to prevent keeping the iner obj references
function Main_Slice(arrayTocopy) {
    if (!arrayTocopy) return [];

    var array;
    //slice may crash RangeError: Maximum call stack size exceeded
    try {
        array = arrayTocopy.slice();
    } catch (e) {
        array = [];

        var i = 0, len = arrayTocopy.length;
        for (i; i < len; i++) {
            array.push(arrayTocopy[i]);
        }

        Main_Log('Main_Slice ' + e);
    }
    return array;
}

var Main_ImageLoaderWorker;
function Main_Setworker() {
    var blobURL = URL.createObjectURL(new Blob(['(',

        function() {
            this.addEventListener('message',
                function(event) {
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.responseType = 'blob';
                    xmlHttp.open('GET', event.data, true);
                    xmlHttp.timeout = 30000;
                    xmlHttp.send();
                }
            );

        }.toString(),

        ')()'], {type: 'application/javascript'}));

    Main_ImageLoaderWorker = new Worker(blobURL);
}

function Main_A_includes_B(A, B) {
    return A ? A.indexOf(B) !== -1 : false;
}

function Main_A_equals_B(A, B) {// jshint ignore:line
    return A === B;
}

function Main_A_equals_B_No_Case(A, B) {// jshint ignore:line
    return (A ? A.toLowerCase() : null) === (B ? B.toLowerCase() : null);
}

function Main_endsWith(str, suffix) {
    return str && suffix && str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function Main_startsWith(str, suffix) {
    return str && !str.indexOf(suffix);
}

var BradcastCheckerWorker;

function Main_SetHistoryworker() {

    var blobURL = URL.createObjectURL(new Blob(['(',

        function() {
            this.addEventListener('message',
                function(event) {
                    var theUrl, onload;

                    if (event.data.type === 1) {//Live check if is a vod

                        theUrl = 'https://api.twitch.tv/kraken/streams/?stream_type=all&channel=' + event.data.obj.data[14] + '&api_version=5';

                        onload = function(obj) {

                            if (obj.status === 200) {

                                var response = JSON.parse(obj.responseText);

                                if (response.streams && response.streams.length) {

                                    if (obj.mData.obj.data[7] !== response.streams[0]._id) {

                                        this.postMessage(
                                            {
                                                data: obj.mData.obj.data[7],
                                                ended: true,
                                                type: event.data.type
                                            }
                                        );

                                    } else {

                                        this.postMessage(
                                            {
                                                data: response.streams[0],
                                                ended: false,
                                                type: event.data.type
                                            }
                                        );

                                    }

                                } else {

                                    this.postMessage(
                                        {
                                            data: obj.mData.obj.data[7],
                                            ended: true,
                                            type: event.data.type
                                        }
                                    );

                                }

                            }

                        };

                    } else if (event.data.type === 'live' || event.data.type === 'vod') {//Live that is not a VOD or VOD

                        theUrl = 'https://api.twitch.tv/kraken/videos/' + (event.data.type === 'live' ? event.data.obj.vodid : event.data.obj.data[7]) + '?api_version=5';

                        onload = function(obj) {

                            if (obj.status !== 200) {

                                var message = JSON.parse(obj.responseText).message;

                                //VOD was deleted
                                if (message && (typeof message === "string")) {
                                    message = message.toLowerCase();

                                    if ((message.indexOf('not found') > -1) && (message.indexOf(obj.mData.obj.data[7] > -1))) {

                                        this.postMessage(
                                            {
                                                data: obj.mData.obj.data[7],
                                                type: obj.mData.type,
                                                delete: true
                                            }
                                        );
                                    }

                                }

                            } else {

                                this.postMessage(
                                    {
                                        data: obj.mData.obj.data[7],
                                        type: obj.mData.type,
                                        updateobj: JSON.parse(obj.responseText),
                                        delete: false
                                    }
                                );

                            }

                        };
                    } else if (event.data.type === 'clip') {//Clip

                        theUrl = 'https://api.twitch.tv/kraken/clips/' + event.data.obj.data[0] + '?api_version=5';

                        onload = function(obj) {

                            if (obj.status !== 200) {

                                var message = JSON.parse(obj.responseText).message;

                                //Clip was deleted
                                if (message && (typeof message === "string") && (message.toLowerCase().indexOf('clip does not exist') > -1)) {

                                    this.postMessage(
                                        {
                                            data: obj.mData.obj.data[7],
                                            type: obj.mData.type
                                        }
                                    );

                                }

                            }

                        };
                    }

                    setTimeout(
                        function() {

                            var xmlHttp = new XMLHttpRequest();

                            xmlHttp.mData = event.data;

                            xmlHttp.open("GET", theUrl, true);
                            xmlHttp.timeout = 30000;

                            xmlHttp.setRequestHeader('Client-ID', '5seja5ptej058mxqy7gh5tcudjqtm9');
                            xmlHttp.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');

                            xmlHttp.onreadystatechange = function() {

                                if (this.readyState === 4) onload(this);

                            };

                            xmlHttp.send(null);

                        },
                        event.data.delay ? event.data.delay * 50 : 0
                    );

                }

            );

        }.toString(),

        ')()'], {type: 'application/javascript'}));

    BradcastCheckerWorker = new Worker(blobURL);

    BradcastCheckerWorker.addEventListener('message',
        function(event) {
            //Minor delay to not block Main tread when the workers return values
            Main_setTimeout(
                function() {

                    var index;

                    if (event.data.type === 1) {//live that is now a valid vod

                        if (event.data.ended) {

                            index = Main_history_Exist('live', event.data.data);

                            if (index > -1) {

                                if (Main_values_History_data[AddUser_UsernameArray[0].id].live[index].vodid) {

                                    Main_values_History_data[AddUser_UsernameArray[0].id].live[index] = Screens_assign(
                                        Main_values_History_data[AddUser_UsernameArray[0].id].live[index],
                                        {
                                            forceVod: true
                                        }
                                    );

                                } else Main_values_History_data[AddUser_UsernameArray[0].id].live.splice(index, 1);//delete the live entry as it doesn't have a VOD

                            }

                        } else {

                            Main_Set_history('live', ScreensObj_LiveCellArray(event.data.data), true);

                        }
                    } else if (event.data.type === 'live') {

                        if (event.data.delete) {

                            index = Main_history_Exist(event.data.type, event.data.data);

                            if (index > -1) {

                                //delete the live that is now a vod entry as it no longer exist
                                Main_values_History_data[AddUser_UsernameArray[0].id][event.data.type].splice(index, 1);

                            }

                        } else {

                            Main_history_UpdateLiveVod(
                                event.data.data,
                                event.data.updateobj._id.substr(1),
                                ScreensObj_VodGetPreview(
                                    event.data.updateobj.preview.template,
                                    event.data.updateobj.animated_preview_url
                                )
                            );

                        }

                    } else if (event.data.type === 'vod' || event.data.type === 'clip') {

                        index = Main_history_Exist(event.data.type, event.data.data);

                        if (index > -1) {

                            //delete the entry as its content no longer exist
                            Main_values_History_data[AddUser_UsernameArray[0].id][event.data.type].splice(index, 1);

                        }

                    }

                },
                10
            );


        }

    );
}

var Main_StartHistoryworkerId;

//Check if a live in history has become a VOD
function Main_StartHistoryworker() {

    if (!AddUser_IsUserSet() || !BradcastCheckerWorker) return;

    var array = Main_values_History_data[AddUser_UsernameArray[0].id].live;

    var i = 0, len = array.length;

    for (i; i < len; i++) {

        if (!array[i].forceVod) {

            if (array[i].data[14] && array[i].data[14] !== '') {

                BradcastCheckerWorker.postMessage(
                    {
                        obj: array[i],
                        type: 1
                    }
                );

            } else {

                array.splice(i, 1);

            }
        }
    }
}

//Check if a VOD in history has ben deleted
function Main_RunVODWorker() {

    if (ScreenObj[Main_HistoryVod].histPosX[3] ||
        Main_isStoped ||
        !AddUser_IsUserSet() ||
        Boolean(!BradcastCheckerWorker)) return;

    var array = Main_values_History_data[AddUser_UsernameArray[0].id].vod,
        i = 0, len = array.length;

    for (i; i < len; i++) {

        //TODO remove this workaround after some updates
        array[i].data[2] = array[i].data[2].replace("Streamed", '');
        array[i].data[4] = array[i].data[4].replace("Views", '');

        BradcastCheckerWorker.postMessage(
            {
                obj: array[i],
                type: 'vod',
                delay: i
            }
        );

    }


    Main_setTimeout(Main_RunLiveVODWorker, 60000);

}

//Check if a Live that is now VOD in Live history has ben deleted
function Main_RunLiveVODWorker() {

    if (ScreenObj[Main_HistoryLive].histPosX[3] || Main_isStoped || !AddUser_IsUserSet() || !BradcastCheckerWorker) return;

    var array = Main_values_History_data[AddUser_UsernameArray[0].id].live,
        i = 0, len = array.length;

    for (i; i < len; i++) {

        //TODO remove this workaround after some updates
        array[i].data[11] = array[i].data[11].replace("Since", '');
        array[i].data[4] = array[i].data[4].replace("Viewers", '');

        if (array[i].forceVod && array[i].vodid) {

            BradcastCheckerWorker.postMessage(
                {
                    obj: array[i],
                    type: 'live',
                    delay: i
                }
            );

        }

    }
}

//Check if a CLIP in history has ben deleted
function Main_RunClipWorker() {

    if (ScreenObj[Main_HistoryClip].histPosX[3] || Main_isStoped || !AddUser_IsUserSet() || !BradcastCheckerWorker) return;

    var array = Main_values_History_data[AddUser_UsernameArray[0].id].clip;

    var i = 0, len = array.length;

    for (i; i < len; i++) {

        //TODO remove this workaround after some updates
        array[i].data[16] = array[i].data[16].replace("Created", '');
        array[i].data[14] = array[i].data[14].replace("Views", '');

        BradcastCheckerWorker.postMessage(
            {
                obj: array[i],
                type: 'clip',
                delay: i
            }
        );

    }
}

//the internet connection may be down do to standby after resume
//java will not call Main_CheckResume() until the internet connection is recognized
function Main_PreventClick(prevent, fun, skipUpPress) {

    if (prevent) {

        window.addEventListener("keydown", fun, true);
        if (!skipUpPress) {

            window.addEventListener("keyup", fun, true);
            window.addEventListener("keypress", fun, true);

        }

    } else {

        window.removeEventListener("keydown", fun, true);
        window.removeEventListener("keyup", fun, true);
        window.removeEventListener("keypress", fun, true);

    }
}

function Main_PreventClickfun(e) {
    e.stopPropagation();
}

var Main_isStoped = false;

function Main_CheckStop() { // Called only by JAVA
    Main_isStoped = true;
    Main_PreventClick(true, Main_PreventClickfun);

    //Player related
    ChatLive_Clear(0);
    ChatLive_Clear(1);
    Chat_Clear();
    Settings_DisableAutoMinimizeTimeout();

    Main_clearInterval(Play_ResumeAfterOnlineId);
    Main_clearInterval(Play_streamInfoTimerId);
    Main_clearInterval(Play_ShowPanelStatusId);

    Main_clearInterval(PlayVod_RefreshProgressBarrID);
    Main_clearInterval(PlayVod_SaveOffsetId);

    if (PlayClip_isOn) PlayClip_Resume();
    else if (Play_isOn) {
        if (Play_MultiEnable) {
            var i = 0;

            for (i; i < Play_MultiArray_length; i++) {

                if (Play_MultiArray[i].data.length > 0) {

                    Main_Set_history('live', Play_MultiArray[i].data);

                }

            }

        } else if (PlayExtra_PicturePicture) {

            if (PlayExtra_data.data.length > 0) Main_Set_history('live', PlayExtra_data.data);
            if (Play_data.data.length > 0) Main_Set_history('live', Play_data.data);

        } else if (Play_data.data.length > 0 && !Play_StayDialogVisible()) Main_Set_history('live', Play_data.data);
    }

    Play_StopStay();
    Main_clearTimeout(Main_setHistoryItemId);
    Main_SaveHistoryItem();
    //General related
    Screens_ClearAnimation(Main_values.Main_Go);

    Main_clearInterval(Main_updateclockId);
    Main_clearInterval(Main_StartHistoryworkerId);
    Main_clearInterval(Main_checkWebVersionId);
    Main_clearTimeout(Main_checkWebVersionResumeId);
    Main_clearTimeout(Screens_CheckRefreshAfterResumeId);
    Main_clearTimeout(Main_CheckResumeFeedId);
    Main_clearTimeout(Main_CheckResumeVodsId);

    if (Main_CheckAccessibilityVisible()) Main_CheckAccessibilityHide(true);

    if (Main_isElementShowing('chat_send')) ChatLiveControls_Hide();

    //Hide setting if showing
    if (Settings_isVisible()) {
        if (Settings_Codecs_isVisible()) {
            if (Settings_CodecsDialogSet) Settings_RemoveinputFocusKey(Settings_CodecsValue[Settings_CodecsPos].name);
            Main_HideElement('dialog_codecs');
            Main_removeEventListener("keydown", Settings_handleKeyDownCodecs);
        } else if (Settings_Dialog_isVisible()) {
            if (SettingsColor_DialogisVisible()) SettingsColor_DialogColorsHide();
            if (Settings_DialogValue.length) Settings_DialoghandleKeyDown(Settings_DialogValue[Settings_DialogPos]);
            Main_HideElement('dialog_settings');
            Main_removeEventListener("keydown", Settings_DialoghandleKeyDown);
        }
        Settings_exit();
        Main_SwitchScreen();
    } else if (Main_isAboutDialogVisible() || Main_isControlsDialogVisible()) {//Hide about or related if showing

        Main_HideControlsDialog();
        Main_HideAboutDialog();
        Main_removeEventListener("keydown", ScreenObj[Main_values.Main_Go].key_controls);

        Main_addEventListener("keydown", ScreenObj[Main_values.Main_Go].key_fun);
        if (ScreenObj[Main_values.Main_Go].addFocus) Screens_addFocus(true, Main_values.Main_Go);
        else ScreenObj[Main_values.Main_Go].init_fun();

    } else if (Main_isExitDialogVisible()) {//Hide exit if showing

        Main_HideExitDialog();

    }

    //Reset Screen img if hiden
    var doc = ScreenObj[Main_values.Main_Go].ids ? Main_getElementById(ScreenObj[Main_values.Main_Go].ids[1] + ScreenObj[Main_values.Main_Go].posY + '_' + ScreenObj[Main_values.Main_Go].posX) : null;
    if (doc) Main_RemoveClassWithEle(doc, 'opacity_zero');
    else if (ChannelContent_Isfocused()) {
        Main_RemoveClass('channel_content_cell0_1_img', 'opacity_zero');
    }
}

var Main_CheckResumeFeedId;
var Main_CheckResumeVodsId;
function Main_CheckResume(skipPlay) { // Called only by JAVA
    Main_PreventClick(false, Main_PreventClickfun);
    Main_isStoped = false;

    //When the app first start the dialog will show on that case if the user stop the app the dialog will be there
    //but the aap is not ready for the rest of the check on this fun
    if (Main_PreventCheckResume) return;

    if (Main_isUpdateDialogVisible()) {

        Main_HideLoadDialog();
        Main_values.IsUpDating = false;

    }

    var UserIsSet = AddUser_UserIsSet();

    Main_CheckResumeUpdateToken(UserIsSet);

    Main_SetUpdateclock();

    if (!skipPlay && (Main_isScene2DocVisible() || Sidepannel_isShowingUserLive())) Play_CheckResume();
    else Play_CheckIfIsLiveCleanEnd();//Reset to Screens_addFocus check for live can work

    if (UserIsSet) {
        Main_CheckResumeFeedId = Main_setTimeout(Main_updateUserFeed, 2000, Main_CheckResumeFeedId);
    }

    Main_StartHistoryworkerId = Main_setInterval(Main_StartHistoryworker, (1000 * 60 * 3), Main_StartHistoryworkerId);//Check it 3 min

    Main_CheckResumeVodsId = Main_setTimeout(Main_StartHistoryworker, 10000, Main_CheckResumeVodsId);

    Main_checkWebVersionId = Main_setInterval(Main_CheckUpdate, (1000 * 60 * 30), Main_checkWebVersionId);//Check it 60 min
    Main_checkWebVersionResumeId = Main_setTimeout(Main_CheckUpdate, 3000, Main_checkWebVersionResumeId);

    //Tecnicly this are only neede if the app fail to refresh when is on background
    UserLiveFeed_CheckRefreshAfterResume();
    Screens_CheckRefreshAfterResumeId = Main_setTimeout(Screens_CheckRefreshAfterResume, 2500, Screens_CheckRefreshAfterResumeId);

    if (!skipPlay) Main_CheckAccessibility();

    Settings_SetAutoMinimizeTimeout();
}

function Main_CheckResumeUpdateToken(UserIsSet) {
    //Check on resume if token has expired and refresh
    //The token may expire while the device is on standby and on that case even if the app is running
    //the internet connection may be down (do to standby), on that case the update token fun will run and not work
    //On that case the expires_when will be less the time now and we need to update on resume
    //If the app closes next reopen the same check will happen but somewhere else
    if (UserIsSet && AddUser_UsernameArray[0].access_token &&
        (((new Date().getTime()) - AddUser_UsernameArray[0].expires_when) > 0)) {
        AddCode_refreshTokens(0, null, null, null, true);
    }
}

function Main_CheckAccessibility(skipRefresCheck) {
    //Main_Log('Main_CheckAccessibility');

    if (Main_IsOn_OSInterface && Settings_Obj_default("accessibility_warn")) {
        if (OSInterface_isAccessibilitySettingsOn()) Main_CheckAccessibilitySet();
        else {
            Main_CheckAccessibilityHide(false);
            //if focused and showing force a refresh check
            if ((Screens_Isfocused() || ChannelContent_Isfocused()) &&
                (!Sidepannel_isShowingUserLive() && !Sidepannel_isShowingMenus()) &&
                !skipRefresCheck) {
                Main_removeEventListener("keydown", ScreenObj[Main_values.Main_Go].key_fun);
                Main_SwitchScreen();
            }
        }

    }
}

function Main_CheckAccessibilitySet() {
    //Main_Log('Main_CheckAccessibilitySet');

    Main_innerHTML("dialog_accessibility_text", STR_ACCESSIBILITY_WARN_TEXT);
    Main_ShowElement('dialog_accessibility');
    Main_removeEventListener("keydown", ScreenObj[Main_values.Main_Go].key_fun);
    Main_removeEventListener("keydown", Main_CheckAccessibilityKey);
    if (!Sidepannel_isShowingUserLive() && Main_isScene1DocVisible()) {
        Sidepannel_Hide();
        Main_addEventListener("keydown", Main_CheckAccessibilityKey);
    }
}

function Main_CheckAccessibilityVisible() {
    return Main_isElementShowing('dialog_accessibility');
}

function Main_CheckAccessibilityHide(switchScreen) {
    Main_removeEventListener("keydown", Main_CheckAccessibilityKey);
    Main_HideElement('dialog_accessibility');
    if (switchScreen) Main_SwitchScreen();
}

function Main_CheckAccessibilityKey(event) {
    switch (event.keyCode) {
        case KEY_KEYBOARD_BACKSPACE:
        case KEY_RETURN:
        case KEY_ENTER:
            if (!Main_isControlsDialogVisible() && !Main_isWelcomeDialogVisible() && Main_isScene1DocVisible()) {
                Main_CheckAccessibilityHide(true);
            }
            break;
        default:
            break;
    }
}

function Main_LoadUrl(url) {
    if (Main_IsOn_OSInterface) OSInterface_mloadUrl(url);
    else window.location = url;
}

function Main_Log(text) {
    if (Main_isDebug) {
        text = text + ' ' + Main_LogDate(new Date());
        console.log(text);
        OSInterface_LongLog(text);
    }
}

function Main_LogDate(date) {
    return date.toLocaleTimeString([], {hour12: false}) + '.' + date.getMilliseconds();
}

function Main_addEventListener(type, fun) {
    Main_removeEventListener(type, fun);
    Main_body.addEventListener(type, fun);
}

function Main_removeEventListener(type, fun) {
    Main_body.removeEventListener(type, fun);
}

function Main_setTimeout(fun, timeout, id) {
    Main_clearTimeout(id);
    if (timeout && timeout > 0) return window.setTimeout(fun, timeout);
    else return window.setTimeout(fun);
}

function Main_clearTimeout(id) {
    window.clearTimeout(id);
}

function Main_setInterval(fun, timeout, id) {
    Main_clearInterval(id);
    if (timeout && timeout > 0) return window.setInterval(fun, timeout);
}

function Main_clearInterval(id) {
    window.clearInterval(id);
}

function Main_onNewIntentClearPlay() {

    Play_ClearPlayer();
    Main_removeEventListener("keydown", Play_handleKeyDown);
    Main_removeEventListener("keydown", PlayVod_handleKeyDown);
    Main_removeEventListener("keyup", PlayVod_SeekClear);
    Main_removeEventListener("keydown", PlayClip_handleKeyDown);
    Play_isOn = false;
    PlayVod_isOn = false;
    PlayClip_isOn = false;

    if (Play_MultiEnable) {

        //Make sure PP is disabled first, then disable Multistream at last close all players
        PlayExtra_PicturePicture = false;

        Play_controls[Play_MultiStream].enterKey();

        OSInterface_stopVideo();

    } else if (PlayExtra_PicturePicture) {

        PlayExtra_UnSetPanel();
        PlayExtra_PicturePicture = false;

    }

}

function Main_onNewIntent(mobj) {
    var obj = JSON.parse(mobj),
        isLive = Main_A_equals_B(obj.type, "LIVE");

    //TODO check more cases for problems
    if (isLive) {

        Play_showBufferDialog();
        Main_CheckResume(true);

        if (Main_isScene2DocVisible()) {

            Main_onNewIntentClearPlay();

        } else if (Sidepannel_isShowingMenus()) {
            Sidepannel_Hide(false);
        } else if (Sidepannel_isShowingUserLiveSide()) {
            Sidepannel_Hide(true);
        } else if (ScreenObj[Main_values.Main_Go].exit_fun) ScreenObj[Main_values.Main_Go].exit_fun();

        Play_data = JSON.parse(JSON.stringify(Play_data_base));
        Play_data.data = ScreensObj_LiveCellArray(obj.obj);

        Main_openStream();

        Main_EventPlay(
            'live',
            Play_data.data[6],
            Play_data.data[3],
            isLive ? Play_data.data[15] : 'HOSTING',
            Main_EventGetChannelScreen(obj)
        );

    } else if (Main_A_equals_B(obj.type, "USER")) {

        Main_CheckResume(true);

        //TODO check when side panel is open
        if (Main_isScene2DocVisible()) {
            Main_onNewIntentClearPlay();

            Main_hideScene2Doc();
            Main_showScene1Doc();
        } else if (Sidepannel_isShowingMenus()) {
            Sidepannel_Hide(false);
        }

        if (ScreenObj[Main_values.Main_Go].exit_fun) ScreenObj[Main_values.Main_Go].exit_fun();
        Main_values.Main_Before = Main_values.Main_Go;

        AddUser_init();
    } else if (Main_A_equals_B(obj.type, "GAME")) {

        Main_CheckResume(true);

        Play_data = JSON.parse(JSON.stringify(Play_data_base));
        Play_data.data[3] = obj.obj.name;

        if (Main_isScene2DocVisible()) {
            var PlayVodClip = 1;

            if (PlayVod_isOn) PlayVodClip = 2;
            else if (PlayClip_isOn) PlayVodClip = 3;

            if (Play_MultiEnable) {
                Play_MultiArray[0] = JSON.parse(JSON.stringify(Play_data));
            }

            Play_OpenGame(PlayVodClip);
        } else {

            if (Sidepannel_isShowingUserLiveSide() || Sidepannel_isShowingMenus()) {
                Sidepannel_Hide(false);
            }

            if (!Main_values.Main_BeforeAgameisSet && Main_values.Main_Go !== Main_AGameVod && Main_values.Main_Go !== Main_AGameClip) {
                Main_values.Main_BeforeAgame = (Main_values.Main_BeforeChannelisSet && Main_values.Main_Go !== Main_ChannelContent && Main_values.Main_Go !== Main_ChannelVod && Main_values.Main_Go !== Main_ChannelClip) ? Main_values.Main_BeforeChannel : Main_values.Main_Go;
                Main_values.Main_BeforeAgameisSet = true;
            }

            Main_ExitCurrent(Main_values.Main_Go);
            Main_values.Main_Go = Main_aGame;

            Main_values.Main_gameSelected = Play_data.data[3];
            Main_ReStartScreens();

        }

    } else if (Main_A_equals_B(obj.type, "SCREEN")) {

        Main_CheckResume(true);

        if (Main_isScene2DocVisible()) {

            Main_onNewIntentClearPlay();

            Main_hideScene2Doc();
            Main_showScene1Doc();

        } else if (Sidepannel_isShowingUserLiveSide() || Sidepannel_isShowingMenus()) {
            Sidepannel_Hide(false);
        }

        var goTo = Main_onNewIntentGetScreen(obj);

        if (Main_values.Main_Go !== goTo) {
            if (ScreenObj[Main_values.Main_Go].exit_fun) ScreenObj[Main_values.Main_Go].exit_fun();
            Main_values.Main_Before = goTo;
        }
        Main_values.Main_Go = goTo;

        Main_ReStartScreens();
    } else Main_CheckResume();

    Main_EventChannel(obj);
}

function Main_onNewIntentGetScreen(obj) {
    var goTo = Main_values.Main_Go;
    var UserIsSet = AddUser_UserIsSet();

    switch (obj.screen) {//In relateton to java CHANNEL_TYPE_*
        case 1:
            goTo = Main_Live;
            break;
        case 2:
            if (UserIsSet) goTo = Main_UserLive;
            break;
        case 3:
            goTo = Main_Featured;
            break;
        case 4:
            goTo = Main_games;
            break;
        case 5:
            if (UserIsSet) goTo = Main_usergames;
            break;
        default:
            break;
    }

    return goTo;
}

window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}

var skipfirebase = false;
function Main_Startfirebase() {

    var firebaseConfig = {
        apiKey: "AIzaSyAr2tuLGB5lvredaqU2KWW4p8Yg7sudbzI",
        authDomain: "smarttv-twitch-web-android.firebaseapp.com",
        databaseURL: "https://smarttv-twitch-web-android.firebaseio.com",
        projectId: "smarttv-twitch-web-android",
        storageBucket: "smarttv-twitch-web-android.appspot.com",
        messagingSenderId: "871032203366",
        appId: "1:871032203366:web:922c0cf93432bbe1e7a5a7",
        measurementId: "G-8YQ2JGNYDP"
    };

    try {

        if (!Main_A_includes_B(window.location.href, 'code')) {

            firebase.initializeApp(firebaseConfig);
            firebase.analytics();

            gtag('js', new Date());

        } else skipfirebase = true;

    } catch (e) {
        console.log("Main_Startfirebase e " + e);
        skipfirebase = true;
    }
}

function Main_EventScreen(screen) {
    Main_EventShowScreen(
        'screen_view',
        screen
    );
}

function Main_EventAgame(game) {
    Main_EventShowScreen(
        'game_view',
        game
    );
}

function Main_EventShowScreen(type, name) {
    if (skipfirebase) return;

    try {

        gtag(
            'event',
            type,
            {
                'name': name,
                'lang': Languages_Selected
            }
        );

    } catch (e) {
        console.log("Main_EventShowScreen e " + e);
    }
}

function Main_EventPlay(type, name, game, lang, screen, mode) {
    Main_ready(function() {
        if (skipfirebase) return;

        try {

            gtag(
                'event',
                type,
                {
                    'name': name,
                    'lang': lang ? lang.toUpperCase() : UNKNOWN,
                    'game': game ? game : UNKNOWN,
                    'screen': screen ? screen : UNKNOWN,
                    'mode': mode ? mode : 'NORMAL'
                }
            );

        } catch (e) {
            console.log("Main_EventPlay e " + e);
        }
    });
}

function Main_EventPreview(type, name, game, lang, screen) {
    Main_ready(function() {
        if (skipfirebase) return;

        try {

            gtag(
                'event',
                type,
                {
                    'name': name,
                    'lang': lang ? lang.toUpperCase() : UNKNOWN,
                    'game': game ? game : UNKNOWN,
                    'screen': screen ? screen : UNKNOWN
                }
            );

        } catch (e) {
            console.log("Main_EventPreview e " + e);
        }
    });
}

function Main_EventVersion(apk, web, webview, device, sdk, manufacturer) {
    Main_ready(function() {
        if (skipfirebase) return;

        try {

            //Delay the event if it is call too sone will not work
            Main_setTimeout(
                function() {

                    gtag(
                        'event',
                        'app_version',
                        {
                            'apk_version': apk,
                            'web_version': web,
                            'webview_version': webview,
                            'device_model': device,
                            'sdk': sdk,
                            'manufacturer': manufacturer,
                            'device_type': Main_isTV ? 'TV' : 'Other',
                        }
                    );

                },
                15000
            );

            //Te app willsend this from when the token is added just save a refrecen and use later
            if (Main_getItemInt('New_User_Token_Added', 0)) {
                Main_setItem('New_User_Token_Added', 0);
                Main_Eventsimple('New_User_Token_Added');
            }

        } catch (e) {
            console.log("Main_EventVersion e " + e);
        }
    });
}

function Main_EventChannelRefresh(screen) {
    Main_EventChannel(
        {
            screen: screen,
            type: 'REFRESH'

        }
    );
}

function Main_EventChannel(obj) {
    Main_ready(function() {
        if (skipfirebase) return;

        try {
            if (!obj || !obj.type || !obj.screen) return;

            gtag(
                'event',
                'channel',
                {
                    'type': obj.type,
                    'screen': Main_EventGetChannelScreen(obj)
                }
            );

        } catch (e) {
            console.log("Main_EventChannel e " + e);
        }
    });
}

var UNKNOWN = 'UNKNOWN';
var Main_EventChannelScreens = [
    'CHANNEL_' + UNKNOWN,
    'CHANNEL_LIVE',
    'CHANNEL_USER_LIVE',
    'CHANNEL_FEATURED',
    'CHANNEL_GAMES',
    'CHANNEL_USER_GAMES',
    'CHANNEL_USER_HOSTS'
];

function Main_EventGetChannelScreen(obj) {
    return obj.screen && Main_EventChannelScreens[obj.screen] ?
        Main_EventChannelScreens[obj.screen] : Main_EventChannelScreens[0];
}

function Main_Eventsimple(event) {
    Main_ready(function() {
        if (skipfirebase) return;

        try {

            firebase.analytics().logEvent(event);

        } catch (e) {
            console.log("Main_Eventsimple event " + event + " e " + e);
        }
    });
}
