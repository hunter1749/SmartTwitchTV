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

//Global
var UserLiveFeedobj_AGamesPos = 0;
var UserLiveFeedobj_GamesPos = 1;
var UserLiveFeedobj_FeaturedPos = 2;
var UserLiveFeedobj_CurrentGamePos = 3;
var UserLiveFeedobj_LivePos = 4;
//User
var UserLiveFeedobj_UserLivePos = 5;
var UserLiveFeedobj_UserHistoryPos = 6;
var UserLiveFeedobj_UserGamesPos = 7;
var UserLiveFeedobj_UserAGamesPos = 8;
var UserLiveFeedobj_UserVodPos = 9;
var UserLiveFeedobj_UserVodHistoryPos = 10;

var UserLiveFeedobj_FeedSort = [
    [null, 'viewers', 0],//0
    [null, 'viewers', 1],//1
    ['channel', 'name', 1],//2
    ['channel', 'name', 0],//3
    [null, 'game', 1],//4
    [null, 'game', 0],//5
    [null, 'created_at', 0],//6
    [null, 'created_at', 1]//7
];

// var UserLiveFeedobj_FeedSortGames = [
//     [null, 'viewers', 0],//0
//     [null, 'viewers', 1],//2
//     ['game', 'name', 1],//3
//     ['game', 'name', 0],//4
//     [null, 'channels', 0],//5
//     [null, 'channels', 1]//6
// ];

// var UserLiveFeedobj_FeedSortHost = [
//     [null, 'viewers', 0],//0
//     [null, 'viewers', 1],//1
//     ['channel', 'name', 1],//2
//     ['channel', 'name', 0],//3
//     [null, 'meta_game', 1],//4
//     [null, 'meta_game', 0],//5
//     [null, 'created_at', 0],//6
//     [null, 'created_at', 1]//7
// ];

//Check bellow java before define more current max is 0 to 24, 1 is used by the side panel
//public String[][] ExtraPlayerHandlerResult = new String[25][100];

var UserLiveFeed_FeedPosX = UserLiveFeedobj_UserLivePos;//Default pos
var UserLiveFeedobj_MAX = UserLiveFeedobj_UserVodHistoryPos;
var UserLiveFeedobj_MAX_No_user = UserLiveFeedobj_LivePos;

function UserLiveFeedobj_StartDefault(pos) {

    if (UserLiveFeed_status[pos]) {

        if (UserLiveFeed_ObjNotNull(pos)) {

            Main_values.UserLiveFeed_LastPositionId[pos] =
                UserLiveFeed_DataObj[pos][UserLiveFeed_FeedPosY[pos]][UserLiveFeed_FeedPosX >= UserLiveFeedobj_UserVodPos ? 7 : 14];

            if (!UserLiveFeed_obj[pos].Game_changed) {

                Main_values.UserLiveFeed_LastPosition[pos] = UserLiveFeed_FeedPosY[pos] < 100 ?
                    UserLiveFeed_FeedPosY[pos] : 0;

            }

        }

    }

    Main_date_Ms = new Date().getTime();
    UserLiveFeed_lastRefresh[pos] = new Date().getTime();
    UserLiveFeed_obj[pos].offsettopFontsize = Settings_Obj_default('global_font_offset');
    UserLiveFeed_cell[pos] = [];
    UserLiveFeed_idObject[pos] = {};
    UserLiveFeed_DataObj[pos] = {};

    UserLiveFeed_itemsCount[pos] = 0;
    Main_emptyWithEle(UserLiveFeed_obj[pos].div);
    UserLiveFeed_status[pos] = false;
    UserLiveFeed_FeedPosY[pos] = 0;
    UserLiveFeed_FeedSetPosLast[pos] = 0;
    UserLiveFeed_obj[pos].offset = 0;
    UserLiveFeed_obj[pos].loadingMore = false;
    UserLiveFeed_obj[pos].dataEnded = false;
    UserLiveFeed_obj[pos].div.style.transform = 'translateX(0px)';

    UserLiveFeed_obj[pos].sorting = Settings_value.live_feed_sort.defaultValue;
    UserLiveFeed_obj[pos].ContentLang = Main_ContentLang;
    UserLiveFeed_obj[pos].Lang = Settings_AppLang;

    if (UserLiveFeed_isPreviewShowing()) {

        UserLiveFeed_obj[pos].div.classList.remove('hide');

    }
}

function UserLiveFeedobj_CheckToken() {
    Main_clearTimeout(Main_CheckResumeFeedId);

    if (UserLiveFeed_status[UserLiveFeedobj_UserLivePos] && Sidepannel_ObjNotNull(UserLiveFeedobj_UserLivePos)) {

        Main_values.UserSidePannel_LastPositionId = UserLiveFeed_DataObj[UserLiveFeedobj_UserLivePos][Sidepannel_PosFeed][14];
        Main_values.UserSidePannel_LastPosition = Sidepannel_PosFeed;

    }

    Main_ShowElementWithEle(Sidepannel_SidepannelLoadingDialog);
    UserLiveFeed_PreloadImgs = [];
    Sidepannel_PosFeed = 0;
    Main_emptyWithEle(Sidepannel_ScroolDoc);
    Main_textContentWithEle(Sidepannel_PosCounter, '');
    Sidepannel_Html = '';
    Main_getElementById('side_panel_warn').style.display = 'none';

    UserLiveFeed_loadChannelOffsset = 0;
    UserLiveFeed_followerChannels = [];

    UserLiveFeedobj_StartDefault(UserLiveFeedobj_UserLivePos);

    UserLiveFeed_token = AddUser_UsernameArray[0].access_token;

    if (UserLiveFeed_token) {

        UserLiveFeed_token = Main_OAuth + UserLiveFeed_token;
        UserLiveFeedobj_loadChannelUserLive();

    } else {

        UserLiveFeed_token = null;
        UserLiveFeedobj_loadChannels();

    }

    //Main_Log('UserLiveFeedobj_CheckToken end');
}

function UserLiveFeedobj_loadDataPrepare(pos) {
    UserLiveFeed_loadingData[pos] = true;
    Screens_Some_Screen_Is_Refreshing = true;
}

function UserLiveFeedobj_BaseLoad(url, headers, callback, CheckOffset, pos) {

    if (CheckOffset) UserLiveFeedobj_CheckOffset(pos);

    BaseXmlHttpGet(
        url,
        headers,
        null,
        callback,
        UserLiveFeedobj_loadDataError,
        pos
    );
}

function UserLiveFeedobj_loadDataError(pos) {

    if (!UserLiveFeed_obj[pos].loadingMore) {

        UserLiveFeed_loadingData[pos] = false;
        Screens_Some_Screen_Is_Refreshing = false;
        UserLiveFeed_Showloading(false);
        Main_HideElementWithEle(Sidepannel_SidepannelLoadingDialog);

        if (UserLiveFeed_isPreviewShowing() && pos === UserLiveFeed_FeedPosX) {
            UserLiveFeedobj_HolderDiv(pos, STR_REFRESH_PROBLEM);
        }

        if (pos === UserLiveFeedobj_UserLivePos && Sidepannel_isShowingUserLive()) {
            Main_HideWarningDialog();
            Sidepannel_showWarningDialog(STR_REFRESH_PROBLEM, 5000);
        }

    } else {
        UserLiveFeed_obj[pos].loadingMore = false;
        UserLiveFeed_obj[pos].dataEnded = true;
    }

}

function UserLiveFeedobj_Empty(pos) {
    UserLiveFeedobj_HolderDiv(pos, STR_NO_CONTENT);
}

function UserLiveFeedobj_HolderDiv(pos, text) {
    Main_innerHTMLWithEle(UserLiveFeed_obj[pos].div,
        '<div class="strokicon" style="color: #FFFFFF;text-align: center;vertical-align: middle;transform: translateY(20vh);font-size: 150%;"> ' + text + '</div>');
}

function UserLiveFeedobj_loadChannels() {

    var theUrl = Main_kraken_api + 'users/' + encodeURIComponent(AddUser_UsernameArray[0].id) +
        '/follows/channels?limit=100&offset=' + UserLiveFeed_loadChannelOffsset + '&sortby=last_broadcast' + Main_TwithcV5Flag;

    BaseXmlHttpGet(
        theUrl,
        2,
        null,
        UserLiveFeedobj_loadChannelLive,
        UserLiveFeedobj_loadChannelsError,
        UserLiveFeedobj_UserLivePos
    );

}

function UserLiveFeedobj_loadChannelsError(pos) {

    if (!UserLiveFeed_followerChannels.length) UserLiveFeedobj_loadDataError(pos);
    else UserLiveFeedobj_loadChannelLiveEnd();

}

function UserLiveFeedobj_loadChannelLive(responseText) {
    //Main_Log('UserLiveFeedobj_loadChannelLive');

    var response = JSON.parse(responseText).follows,
        response_items = response.length;

    if (response_items) { // response_items here is not always 99 because banned channels, so check until it is 0
        var x = 0,
            max = UserLiveFeed_followerChannels.length + response_items,
            end = false;

        if (max > UserLiveFeed_maxChannels) {
            end = true;
            response_items = Math.min(response_items, response_items - (max - UserLiveFeed_maxChannels));
        }

        for (x; x < response_items; x++) {
            UserLiveFeed_followerChannels.push(response[x].channel._id);
        }

        if (end) {
            UserLiveFeedobj_loadChannelLiveEnd();
        } else {
            UserLiveFeed_loadChannelOffsset += response_items;
            UserLiveFeedobj_loadDataPrepare(UserLiveFeedobj_UserLivePos);
            UserLiveFeedobj_loadChannels();
        }
    } else { // end
        UserLiveFeedobj_loadChannelLiveEnd();
    }
}

function UserLiveFeedobj_loadChannelLiveEnd() {
    UserLiveFeedobj_loadDataPrepare(UserLiveFeedobj_UserLivePos);
    UserLiveFeedobj_loadChannelUserLive();
}

function UserLiveFeedobj_loadChannelUserLive() {
    //Main_Log('UserLiveFeedobj_loadChannelUserLive');
    var theUrl = Main_kraken_api + 'streams/';

    if (UserLiveFeed_token) {
        theUrl += 'followed?';
    } else {
        theUrl += '?channel=' + UserLiveFeed_followerChannels.join() + '&';
    }
    theUrl += 'limit=100&offset=0&stream_type=all' + Main_TwithcV5Flag;

    UserLiveFeedobj_loadChannelUserLiveGet(theUrl);
}

function UserLiveFeedobj_loadChannelUserLiveGet(theUrl) {

    FullxmlHttpGet(
        theUrl,
        Main_GetHeader(UserLiveFeed_token ? 3 : 2, UserLiveFeed_token),
        UserLiveFeedobj_loadChannelUserLiveGetEnd,
        noop_fun,
        UserLiveFeedobj_UserLivePos,
        UserLiveFeedobj_UserLivePos,
        null,
        null
    );

}

function UserLiveFeedobj_loadChannelUserLiveGetEnd(xmlHttp) {

    if (xmlHttp.status === 200) {

        UserLiveFeedobj_loadDataSuccess(xmlHttp.responseText);

    } else if (UserLiveFeed_token && (xmlHttp.status === 401 || xmlHttp.status === 403)) { //token expired

        //Token has change or because is new or because it is invalid because user delete in twitch settings
        // so callbackFuncOK and callbackFuncNOK must be the same to recheck the token

        if (AddUser_UserIsSet() && AddUser_UsernameArray[0].access_token) AddCode_refreshTokens(0, UserLiveFeedobj_CheckToken, UserLiveFeedobj_loadDataRefreshTokenError);
        else UserLiveFeedobj_loadDataError(UserLiveFeedobj_UserLivePos);

    } else {

        UserLiveFeedobj_loadDataError(UserLiveFeedobj_UserLivePos);

    }

}

function UserLiveFeedobj_loadDataRefreshTokenError() {
    //Main_Log('UserLiveFeedobj_loadDataRefreshTokenError');

    if (!AddUser_UsernameArray[0].access_token) UserLiveFeedobj_CheckToken();
    else UserLiveFeedobj_loadDataError(UserLiveFeedobj_UserLivePos);
}

var UserLiveFeedobj_LiveFeedOldUserName = '';
function UserLiveFeedobj_ShowFeed() {
    UserLiveFeedobj_SetBottomText(UserLiveFeedobj_UserLivePos - 1);

    if (AddUser_UserIsSet()) {
        UserLiveFeedobj_ShowFeedCheck(UserLiveFeedobj_UserLivePos, (UserLiveFeedobj_LiveFeedOldUserName !== AddUser_UsernameArray[0].name));
        UserLiveFeedobj_LiveFeedOldUserName = AddUser_UsernameArray[0].name;
    }
}

function UserLiveFeedobj_ShowFeedCheck(pos, forceRefressh) {

    if (Main_isScene2DocVisible() && !UserLiveFeed_isPreviewShowing()) UserLiveFeed_Show();

    if (forceRefressh || !UserLiveFeed_ObjNotNull(pos) ||
        (new Date().getTime()) > (UserLiveFeed_lastRefresh[pos] + Settings_GetAutoRefreshTimeout()) ||
        UserLiveFeed_obj[pos].offsettopFontsize !== Settings_Obj_default('global_font_offset') || !UserLiveFeed_obj[pos].AddCellsize ||
        (UserLiveFeed_obj[pos].CheckContentLang && !Main_A_equals_B(UserLiveFeed_obj[pos].ContentLang, Main_ContentLang)) ||
        (UserLiveFeed_obj[pos].CheckSort && !Main_A_equals_B(UserLiveFeed_obj[pos].sorting, Settings_value.live_feed_sort.defaultValue)) ||
        !Main_A_equals_B(UserLiveFeed_obj[pos].Lang, Settings_AppLang)) {

        if (UserLiveFeed_loadingData[pos]) {

            if (UserLiveFeed_isPreviewShowing()) {
                UserLiveFeed_Showloading(true);
                UserLiveFeed_obj[pos].div.classList.remove('hide');
            }
        } else {

            UserLiveFeed_StartLoad();
        }

    } else {

        UserLiveFeed_obj[pos].div.classList.remove('hide');

        UserLiveFeed_FeedAddFocus(true, pos);
    }

    UserLiveFeedobj_SetLastRefresh(pos);

    if (UserLiveFeed_obj[pos].Screen)
        Main_EventScreen(UserLiveFeed_obj[pos].Screen);

}

function UserLiveFeedobj_SetLastRefresh(pos) {
    if (!UserLiveFeed_lastRefresh[pos]) return;

    Main_innerHTML("feed_last_refresh", STR_LAST_REFRESH + Play_timeDay((new Date().getTime()) - UserLiveFeed_lastRefresh[pos]));
}

function UserLiveFeedobj_HideFeed() {
    UserLiveFeed_CheckIfIsLiveSTop();
    UserLiveFeed_obj[UserLiveFeedobj_UserLivePos].div.classList.add('hide');
}

//Live history start
function UserLiveFeedobj_HideHistory() {
    UserLiveFeed_CheckIfIsLiveSTop();
    UserLiveFeed_obj[UserLiveFeedobj_UserHistoryPos].div.classList.add('hide');
}

function UserLiveFeedobj_ShowHistory() {
    UserLiveFeedobj_SetBottomText(UserLiveFeedobj_UserHistoryPos - 1);

    if (AddUser_UserIsSet()) {

        UserLiveFeedobj_StartDefault(UserLiveFeedobj_UserHistoryPos);
        UserLiveFeedobj_ShowFeedCheck(UserLiveFeedobj_UserHistoryPos, true);

    }

}

function UserLiveFeedobj_History() {

    var array = Main_values_History_data[AddUser_UsernameArray[0].id].live;

    array.sort(
        function(a, b) {
            return (a.date > b.date ? -1 : (a.date < b.date ? 1 : 0));
        }
    );

    var pos = UserLiveFeedobj_UserHistoryPos,
        response = JSON.parse(JSON.stringify(array.slice(0, 100))),//first 100 only
        len = response.length,
        response_items = Math.min(len, 100),
        cell, id,
        i = 0,
        itemsCount = UserLiveFeed_itemsCount[pos],
        streamerID = {};

    response_items = Math.min(len, 100);

    if (response_items) {

        for (i; i < response_items; i++) {

            cell = response[i];
            id = cell.data[7];

            if (!cell.forceVod) {

                if (!UserLiveFeed_idObject[pos].hasOwnProperty(id) && cell.data[14] && cell.data[14] !== '') {

                    UserLiveFeed_idObject[pos][id] = itemsCount;

                    UserLiveFeed_cell[pos][itemsCount] =
                        UserLiveFeedobj_CreatFeed(
                            pos,
                            itemsCount,
                            pos + '_' + itemsCount,
                            cell.data,
                            cell.date,
                            cell.vodimg,
                            (streamerID[cell.data[14]] && cell.vodid) || cell.forceVod
                        );

                    streamerID[cell.data[14]] = 1;
                    itemsCount++;
                }

            } else if (len > (response_items + 1)) {
                response_items++;
            }
        }

        if (!itemsCount) UserLiveFeedobj_Empty(pos);

    } else UserLiveFeedobj_Empty(pos);

    UserLiveFeed_itemsCount[pos] = itemsCount;

    UserLiveFeedobj_SetLastPosition(pos);

    UserLiveFeed_loadDataSuccessFinish(pos);
}

//Live history end

//Live Start
function UserLiveFeedobj_Live() {
    if (!UserLiveFeed_obj[UserLiveFeedobj_LivePos].loadingMore) UserLiveFeedobj_StartDefault(UserLiveFeedobj_LivePos);
    UserLiveFeedobj_loadLive();
}

function UserLiveFeedobj_loadLive() {
    var key = Main_Live,
        pos = UserLiveFeedobj_LivePos;

    if (UserLiveFeed_obj[pos].neverLoaded && ScreenObj[key].data) {

        UserLiveFeedobj_loadDataBaseLiveSuccessEnd(
            ScreenObj[key].data.slice(0, 100),
            null,
            pos,
            UserLiveFeed_itemsCount[pos]
        );

    } else {

        UserLiveFeedobj_BaseLoad(
            Main_kraken_api + 'streams?limit=100&offset=' + UserLiveFeed_obj[UserLiveFeedobj_LivePos].offset +
            (Main_ContentLang !== "" ? ('&language=' + Main_ContentLang) : '') +
            Main_TwithcV5Flag,
            2,
            UserLiveFeedobj_loadDataLiveSuccess,
            true,
            pos
        );

    }
    UserLiveFeed_obj[pos].neverLoaded = false;
}

function UserLiveFeedobj_LiveCell(cell) {
    return cell;
}

function UserLiveFeedobj_loadDataLiveSuccess(responseText) {
    UserLiveFeedobj_loadDataBaseLiveSuccess(responseText, UserLiveFeedobj_LivePos);
}

function UserLiveFeedobj_ShowLive() {
    UserLiveFeedobj_SetBottomText(UserLiveFeedobj_LivePos - 1);

    UserLiveFeedobj_ShowFeedCheck(UserLiveFeedobj_LivePos);
}

function UserLiveFeedobj_HideLive() {
    UserLiveFeed_CheckIfIsLiveSTop();
    UserLiveFeed_obj[UserLiveFeedobj_LivePos].div.classList.add('hide');
}

//Live end

//Featured Start
function UserLiveFeedobj_Featured() {
    UserLiveFeedobj_StartDefault(UserLiveFeedobj_FeaturedPos);
    UserLiveFeedobj_loadFeatured();
}

function UserLiveFeedobj_loadFeatured() {
    var key = Main_Featured,
        pos = UserLiveFeedobj_FeaturedPos;

    if (UserLiveFeed_obj[pos].neverLoaded && ScreenObj[key].data) {

        UserLiveFeedobj_loadDataBaseLiveSuccessEnd(
            ScreenObj[key].data.slice(0, 100),
            null,
            pos,
            UserLiveFeed_itemsCount[pos]
        );

    } else {

        UserLiveFeedobj_BaseLoad(
            Main_kraken_api + 'streams/featured?limit=100' + (AddUser_UserIsSet() && AddUser_UsernameArray[0].access_token ? '&oauth_token=' +
                AddUser_UsernameArray[0].access_token : '') + Main_TwithcV5Flag,
            2,
            UserLiveFeedobj_loadDataFeaturedSuccess,
            false,
            pos
        );

    }

    UserLiveFeed_obj[pos].neverLoaded = false;

}

function UserLiveFeedobj_FeaturedCell(cell) {
    return cell.stream;
}

function UserLiveFeedobj_loadDataFeaturedSuccess(responseText) {
    UserLiveFeedobj_loadDataBaseLiveSuccess(responseText, UserLiveFeedobj_FeaturedPos);
}

function UserLiveFeedobj_ShowFeatured() {
    UserLiveFeedobj_SetBottomText(UserLiveFeedobj_FeaturedPos - 1);

    UserLiveFeedobj_ShowFeedCheck(UserLiveFeedobj_FeaturedPos);
}

function UserLiveFeedobj_HideFeatured() {
    UserLiveFeed_CheckIfIsLiveSTop();
    UserLiveFeed_obj[UserLiveFeedobj_FeaturedPos].div.classList.add('hide');
}
//Featured end

//Current game Start
function UserLiveFeedobj_CurrentGame() {
    if (!UserLiveFeed_obj[UserLiveFeedobj_CurrentGamePos].loadingMore)
        UserLiveFeedobj_StartDefault(UserLiveFeedobj_CurrentGamePos);

    UserLiveFeedobj_loadCurrentGame();
}

function UserLiveFeedobj_loadCurrentGame() {
    UserLiveFeedobj_CurrentGameName = Play_data.data[3];

    var key = Main_aGame,
        game = UserLiveFeedobj_CurrentGameName,
        pos = UserLiveFeedobj_CurrentGamePos;

    if (ScreenObj[key].hasBackupData &&
        !UserLiveFeed_itemsCount[pos] &&
        !UserLiveFeed_obj[pos].isReloadScreen &&
        ScreenObj[key].CheckBackupData(game)) {

        UserLiveFeedobj_oldGameDataLoad(pos, game, key);

    } else {

        if (UserLiveFeed_obj[pos].isReloadScreen) {

            UserLiveFeed_obj[pos].data[game] = null;
            UserLiveFeed_obj[pos].cellBackup[game] = null;

        }

        UserLiveFeedobj_BaseLoad(
            Main_kraken_api + 'streams?game=' + encodeURIComponent(Play_data.data[3]) +
            '&limit=100&offset=' + UserLiveFeed_obj[pos].offset +
            (Main_ContentLang !== "" ? ('&language=' + Main_ContentLang) : '') + Main_TwithcV5Flag,
            2,
            UserLiveFeedobj_loadDataCurrentGameSuccess,
            true,
            pos
        );

    }

    UserLiveFeed_obj[pos].isReloadScreen = false;

}

function UserLiveFeedobj_oldGameDataLoad(pos, game, key) {

    UserLiveFeed_lastRefresh[pos] = ScreenObj[key].BackupData.lastScreenRefresh[game];

    if (UserLiveFeed_obj[pos].LastPositionGame[game]) {

        Main_values.UserLiveFeed_LastPosition[pos] =
            UserLiveFeed_obj[pos].LastPositionGame[game];

    }

    var tempData =
        JSON.parse(
            JSON.stringify(
                ScreenObj[key].BackupData.data[game].slice(0, 100)
            )
        );

    if (!UserLiveFeed_obj[pos].data[game]) {

        UserLiveFeed_obj[pos].data[game] = tempData;

    } else {

        UserLiveFeed_obj[pos].data[game] = tempData.length >= UserLiveFeed_obj[pos].data[game].length ? tempData : UserLiveFeed_obj[pos].data[game];

    }

    if (UserLiveFeed_obj[pos].cellBackup[game]) {

        UserLiveFeed_idObject[pos] = JSON.parse(JSON.stringify(UserLiveFeed_obj[pos].idObjectBackup[game]));
        UserLiveFeed_DataObj[pos] = JSON.parse(JSON.stringify(UserLiveFeed_obj[pos].DataObjBackup[game]));
        UserLiveFeed_cell[pos] = Main_Slice(UserLiveFeed_obj[pos].cellBackup[game]);

        UserLiveFeed_itemsCount[pos] = UserLiveFeed_cell[pos].length;

        UserLiveFeedobj_loadDataBaseLiveSuccessFinish(
            pos,
            null,
            UserLiveFeed_itemsCount[pos]
        );

    } else {

        UserLiveFeedobj_loadDataBaseLiveSuccessEnd(
            UserLiveFeed_obj[pos].data[game],
            null,
            pos,
            UserLiveFeed_itemsCount[pos],
            game
        );

    }
}

function UserLiveFeedobj_CurrentGameCell(cell) {
    return cell;
}

function UserLiveFeedobj_loadDataCurrentGameSuccess(responseText) {
    UserLiveFeedobj_loadDataBaseLiveSuccess(
        responseText,
        UserLiveFeedobj_CurrentGamePos,
        UserLiveFeedobj_CurrentGameName
    );
}

var UserLiveFeedobj_CurrentGameName = '';
function UserLiveFeedobj_ShowCurrentGame() {
    UserLiveFeedobj_SetBottomText(UserLiveFeedobj_CurrentGamePos - 1);

    UserLiveFeedobj_ShowFeedCheck(
        UserLiveFeedobj_CurrentGamePos,
        !Main_A_equals_B_No_Case(UserLiveFeedobj_CurrentGameName, Play_data.data[3])
    );
}

function UserLiveFeedobj_HideCurrentGame() {
    UserLiveFeed_CheckIfIsLiveSTop();
    UserLiveFeed_obj[UserLiveFeedobj_CurrentGamePos].div.classList.add('hide');

    UserLiveFeedobj_CurrentGameUpdateLastPositionGame();
}

function UserLiveFeedobj_CurrentGameUpdateLastPositionGame() {
    UserLiveFeed_obj[UserLiveFeedobj_CurrentGamePos].LastPositionGame[Play_data.data[3]] =
        UserLiveFeed_FeedPosY[UserLiveFeedobj_CurrentGamePos];
}
//Current game end

//User Games Start
function UserLiveFeedobj_UserGames() {
    if (!UserLiveFeed_obj[UserLiveFeedobj_UserGamesPos].loadingMore) UserLiveFeedobj_StartDefault(UserLiveFeedobj_UserGamesPos);
    UserLiveFeedobj_loadUserGames();
}

function UserLiveFeedobj_loadUserGames() {
    UserLiveFeedobj_GamesFeedOldUserName = AddUser_UsernameArray[0].name;

    UserLiveFeedobj_BaseLoad(
        Main_kraken_api + 'users/' + encodeURIComponent(AddUser_UsernameArray[0].id) +
        '/follows/games?limit=' + Main_ItemsLimitMax + '&offset=' +
        UserLiveFeed_obj[UserLiveFeedobj_UserGamesPos].offset + Main_TwithcV5Flag,
        2,
        UserLiveFeedobj_loadDataUserGamesSuccess,
        true,
        UserLiveFeedobj_UserGamesPos
    );
}

function UserLiveFeedobj_loadDataUserGamesSuccess(responseText) {
    UserLiveFeedobj_loadDataBaseGamesSuccess(responseText, UserLiveFeedobj_UserGamesPos, 'follows');
}

var UserLiveFeedobj_GamesFeedOldUserName = '';
function UserLiveFeedobj_ShowUserGames() {
    UserLiveFeedobj_SetBottomText(UserLiveFeedobj_UserGamesPos - 1);

    if (AddUser_UserIsSet()) {

        UserLiveFeedobj_ShowFeedCheck(
            UserLiveFeedobj_UserGamesPos,
            (UserLiveFeedobj_GamesFeedOldUserName !== AddUser_UsernameArray[0].name)
        );

    }
}

function UserLiveFeedobj_HideUserGames() {
    UserLiveFeed_obj[UserLiveFeedobj_UserGamesPos].div.classList.add('hide');
}
//User Games end

//Current user a game Start
var UserLiveFeedobj_CurrentUserAGameEnable = false;
function UserLiveFeedobj_CurrentUserAGame() {
    if (!UserLiveFeed_obj[UserLiveFeedobj_UserAGamesPos].loadingMore)
        UserLiveFeedobj_StartDefault(UserLiveFeedobj_UserAGamesPos);

    UserLiveFeedobj_loadCurrentUserAGame();
}

function UserLiveFeedobj_loadCurrentUserAGame() {
    UserLiveFeedobj_CurrentUserAGameName = UserLiveFeedobj_CurrentUserAGameNameEnter;

    var key = Main_aGame,
        game = UserLiveFeedobj_CurrentUserAGameName,
        pos = UserLiveFeedobj_UserAGamesPos;

    if (ScreenObj[key].hasBackupData &&
        !UserLiveFeed_itemsCount[pos] &&
        !UserLiveFeed_obj[pos].isReloadScreen &&
        ScreenObj[key].CheckBackupData(game)) {

        UserLiveFeedobj_oldGameDataLoad(pos, game, key);

    } else {

        if (UserLiveFeed_obj[pos].isReloadScreen) {

            UserLiveFeed_obj[pos].data[game] = null;
            UserLiveFeed_obj[pos].cellBackup[game] = null;

        }

        UserLiveFeedobj_BaseLoad(
            Main_kraken_api + 'streams?game=' + encodeURIComponent(UserLiveFeedobj_CurrentUserAGameNameEnter) +
            '&limit=100&offset=' + UserLiveFeed_obj[UserLiveFeedobj_UserAGamesPos].offset +
            (Main_ContentLang !== "" ? ('&language=' + Main_ContentLang) : '') + Main_TwithcV5Flag,
            2,
            UserLiveFeedobj_loadDataCurrentUserGameSuccess,
            true,
            pos
        );
    }

    UserLiveFeed_obj[pos].isReloadScreen = false;

}

function UserLiveFeedobj_CurrentUserGameCell(cell) {
    return cell;
}

function UserLiveFeedobj_loadDataCurrentUserGameSuccess(responseText) {
    UserLiveFeedobj_loadDataBaseLiveSuccess(
        responseText,
        UserLiveFeedobj_UserAGamesPos,
        UserLiveFeedobj_CurrentUserAGameName
    );
}

var UserLiveFeedobj_CurrentUserAGameName = '';
var UserLiveFeedobj_CurrentUserAGameNameEnter = null;
function UserLiveFeedobj_ShowCurrentUserAGame() {
    UserLiveFeedobj_SetBottomText(UserLiveFeedobj_UserGamesPos - 1);

    UserLiveFeed_obj[UserLiveFeedobj_UserAGamesPos].Game_changed = !Main_A_equals_B_No_Case(
        UserLiveFeedobj_CurrentUserAGameName,
        UserLiveFeedobj_CurrentUserAGameNameEnter
    );

    if (UserLiveFeed_obj[UserLiveFeedobj_UserAGamesPos].Game_changed ||
        !UserLiveFeedobj_CurrentUserAGameNameEnter) {
        Main_values.UserLiveFeed_LastPosition[UserLiveFeedobj_UserAGamesPos] = 0;
    }

    UserLiveFeedobj_ShowFeedCheck(
        UserLiveFeedobj_UserAGamesPos,
        UserLiveFeed_obj[UserLiveFeedobj_UserAGamesPos].Game_changed
    );
    Main_IconLoad('icon_feed_back', 'icon-arrow-left', STR_BACK_USER_GAMES + STR_USER + STR_SPACE_HTML + STR_GAMES);
    if (!Settings_Obj_default("hide_etc_help_text")) Main_RemoveClass('icon_feed_back', 'opacity_zero');
    Main_EventAgame(UserLiveFeedobj_CurrentUserAGameName);

}

function UserLiveFeedobj_HideCurrentUserAGame() {
    UserLiveFeed_CheckIfIsLiveSTop();
    UserLiveFeed_obj[UserLiveFeedobj_UserAGamesPos].div.classList.add('hide');

    UserLiveFeedobj_CurrentUserAGameUpdateLastPositionGame();

}

function UserLiveFeedobj_CurrentUserAGameUpdateLastPositionGame() {
    UserLiveFeed_obj[UserLiveFeedobj_UserAGamesPos].LastPositionGame[UserLiveFeedobj_CurrentUserAGameName] =
        UserLiveFeed_FeedPosY[UserLiveFeedobj_UserAGamesPos];

}

//Current user a game end

//Games Start
function UserLiveFeedobj_Games() {
    if (!UserLiveFeed_obj[UserLiveFeedobj_GamesPos].loadingMore) UserLiveFeedobj_StartDefault(UserLiveFeedobj_GamesPos);
    UserLiveFeedobj_loadGames();
}

function UserLiveFeedobj_loadGames() {
    var key = Main_games,
        pos = UserLiveFeedobj_GamesPos;

    if (UserLiveFeed_obj[pos].neverLoaded && ScreenObj[key].data) {

        UserLiveFeedobj_loadDataGamesSuccessEnd(
            ScreenObj[key].data.slice(0, 100),
            ScreenObj[key].MaxOffset,
            pos,
            UserLiveFeed_itemsCount[pos]
        );

    } else {

        UserLiveFeedobj_BaseLoad(
            Main_kraken_api + 'games/top?limit=100&offset=' + UserLiveFeed_obj[UserLiveFeedobj_GamesPos].offset,
            2,
            UserLiveFeedobj_loadDataGamesSuccess,
            false,
            pos
        );

    }
    UserLiveFeed_obj[pos].neverLoaded = false;

    if (UserLiveFeed_obj[UserLiveFeedobj_GamesPos].offset &&
        (UserLiveFeed_obj[UserLiveFeedobj_GamesPos].offset + 100) > UserLiveFeed_obj[UserLiveFeedobj_GamesPos].MaxOffset)
        UserLiveFeed_obj[UserLiveFeedobj_GamesPos].dataEnded = true;
}

function UserLiveFeedobj_loadDataGamesSuccess(responseText) {
    UserLiveFeedobj_loadDataBaseGamesSuccess(responseText, UserLiveFeedobj_GamesPos, 'top');
}

function UserLiveFeedobj_ShowGames() {
    UserLiveFeedobj_SetBottomText(UserLiveFeedobj_AGamesPos);

    UserLiveFeedobj_ShowFeedCheck(UserLiveFeedobj_GamesPos);
}

function UserLiveFeedobj_HideGames() {
    UserLiveFeed_obj[UserLiveFeedobj_GamesPos].div.classList.add('hide');
}
//Games end

//Current a game Start
var UserLiveFeedobj_CurrentAGameEnable = false;
function UserLiveFeedobj_CurrentAGame() {
    if (!UserLiveFeed_obj[UserLiveFeedobj_AGamesPos].loadingMore)
        UserLiveFeedobj_StartDefault(UserLiveFeedobj_AGamesPos);

    UserLiveFeedobj_loadCurrentAGame();
}

function UserLiveFeedobj_loadCurrentAGame() {
    var key = Main_aGame,
        game = UserLiveFeedobj_CurrentAGameNameEnter,
        pos = UserLiveFeedobj_AGamesPos;

    if (ScreenObj[key].hasBackupData &&
        !UserLiveFeed_itemsCount[pos] &&
        !UserLiveFeed_obj[pos].isReloadScreen &&
        ScreenObj[key].CheckBackupData(game)) {

        UserLiveFeedobj_oldGameDataLoad(pos, game, key);

    } else {

        if (UserLiveFeed_obj[pos].isReloadScreen) {

            UserLiveFeed_obj[pos].data[game] = null;
            UserLiveFeed_obj[pos].cellBackup[game] = null;

        }

        UserLiveFeedobj_BaseLoad(
            Main_kraken_api + 'streams?game=' + encodeURIComponent(UserLiveFeedobj_CurrentAGameNameEnter) +
            '&limit=100&offset=' + UserLiveFeed_obj[UserLiveFeedobj_AGamesPos].offset +
            (Main_ContentLang !== "" ? ('&language=' + Main_ContentLang) : '') + Main_TwithcV5Flag,
            2,
            UserLiveFeedobj_loadDataCurrentAGameSuccess,
            true,
            pos
        );

    }

    UserLiveFeed_obj[pos].isReloadScreen = false;
}

function UserLiveFeedobj_CurrentAGameCell(cell) {
    return cell;
}

function UserLiveFeedobj_loadDataCurrentAGameSuccess(responseText) {
    UserLiveFeedobj_loadDataBaseLiveSuccess(
        responseText,
        UserLiveFeedobj_AGamesPos,
        UserLiveFeedobj_CurrentAGameNameEnter
    );
}

var UserLiveFeedobj_CurrentAGameName = '';
var UserLiveFeedobj_CurrentAGameNameEnter = null;
function UserLiveFeedobj_ShowCurrentAGame() {
    UserLiveFeedobj_SetBottomText(UserLiveFeedobj_AGamesPos);

    UserLiveFeed_obj[UserLiveFeedobj_AGamesPos].Game_changed =
        !Main_A_equals_B_No_Case(
            UserLiveFeedobj_CurrentAGameName,
            UserLiveFeedobj_CurrentAGameNameEnter
        );

    if (UserLiveFeed_obj[UserLiveFeedobj_AGamesPos].Game_changed ||
        !UserLiveFeedobj_CurrentAGameNameEnter) {
        Main_values.UserLiveFeed_LastPosition[UserLiveFeedobj_AGamesPos] = 0;
    }

    UserLiveFeedobj_ShowFeedCheck(
        UserLiveFeedobj_AGamesPos,
        UserLiveFeed_obj[UserLiveFeedobj_AGamesPos].Game_changed
    );

    UserLiveFeedobj_CurrentAGameName = UserLiveFeedobj_CurrentAGameNameEnter;
    Main_IconLoad('icon_feed_back', 'icon-arrow-left', STR_BACK_USER_GAMES + STR_GAMES);
    if (!Settings_Obj_default("hide_etc_help_text")) Main_RemoveClass('icon_feed_back', 'opacity_zero');
    Main_EventAgame(UserLiveFeedobj_CurrentAGameName);
}

function UserLiveFeedobj_HideCurrentAGame() {
    UserLiveFeed_CheckIfIsLiveSTop();
    UserLiveFeed_obj[UserLiveFeedobj_AGamesPos].div.classList.add('hide');

    UserLiveFeedobj_CurrentAGameUpdateLastPositionGame();

}

function UserLiveFeedobj_CurrentAGameUpdateLastPositionGame() {
    UserLiveFeed_obj[UserLiveFeedobj_AGamesPos].LastPositionGame[UserLiveFeedobj_CurrentAGameNameEnter] =
        UserLiveFeed_FeedPosY[UserLiveFeedobj_AGamesPos];

}
//Current a game end

var UserLiveFeedobj_SetBottomTextId;
function UserLiveFeedobj_SetBottomText(pos) {
    Play_HideWarningMidleDialog();

    var i = 0, len = (UserLiveFeedobj_MAX - 1);
    for (i; i < len; i++)
        Main_RemoveClass('feed_end_' + i, 'feed_end_name_focus');

    Main_AddClass('feed_end_' + pos, 'feed_end_name_focus');

    len = (UserLiveFeedobj_MAX - 2);

    for (i = 0; i < len; i++) {
        if (i < pos) {
            Main_RemoveClass('feed_end_icon_' + i, 'feed_end_icon_up');
            Main_AddClass('feed_end_icon_' + i, 'feed_end_icon_down');

            Main_RemoveClass('feed_end_icon_' + i, 'icon-key-down');
            Main_AddClass('feed_end_icon_' + i, 'icon-key-up');
        } else {
            Main_RemoveClass('feed_end_icon_' + i, 'feed_end_icon_down');
            Main_AddClass('feed_end_icon_' + i, 'feed_end_icon_up');

            Main_RemoveClass('feed_end_icon_' + i, 'icon-key-up');
            Main_AddClass('feed_end_icon_' + i, 'icon-key-down');
        }
    }

    Main_innerHTML('feed_end_0', (UserLiveFeedobj_CurrentAGameEnable ? UserLiveFeedobj_CurrentAGameNameEnter : (STR_GAMES)));
    Main_innerHTML('feed_end_2', (Play_data.data[3] !== '' ? Play_data.data[3] : STR_NO_GAME));
    Main_innerHTML('feed_end_6', (UserLiveFeedobj_CurrentUserAGameEnable ? UserLiveFeedobj_CurrentUserAGameNameEnter : (STR_USER + STR_SPACE_HTML + STR_GAMES)));

    if (Settings_Obj_default("hide_etc_help_text") === 1) {
        Main_RemoveClass('feed_end', 'opacity_zero');

        UserLiveFeedobj_SetBottomTextId = Main_setTimeout(
            function() {
                Main_AddClass('feed_end', 'opacity_zero');
            },
            1500,
            UserLiveFeedobj_SetBottomTextId
        );
    }
}

function UserLiveFeedobj_CreatSideFeed(id, data) {

    return '<div id="' + UserLiveFeed_side_ids[3] + id +
        '" class="side_panel_feed"><div id="' + UserLiveFeed_side_ids[0] + id +
        '" class="side_panel_div"><div id="' + UserLiveFeed_side_ids[2] + id +
        '" style="width: 100%;"><div style="display: none;">' + data[1] +
        '</div><div class="side_panel_iner_div1"><img id="' + UserLiveFeed_side_ids[1] + id +
        '" alt="" class="side_panel_channel_img" src="' + data[9] +
        '" onerror="this.onerror=null;this.src=\'' + IMG_404_LOGO +
        '\';"></div><div class="side_panel_iner_div2"><div class="side_panel_new_title">' + Main_ReplaceLargeFont(data[1]) +
        '</div><div class="side_panel_new_game">' + data[3] +
        '</div></div><div class="side_panel_iner_div3"><div style="text-align: center;"><i class="icon-' +
        (!data[8] ? 'circle" style="color: red;' : 'refresh" style="') +
        ' font-size: 55%; "></i><div style="font-size: 58%;">' + Main_addCommas(data[13]) + '</div></div></div></div></div></div></div>';

}

function UserLiveFeedobj_CreatFeed(pos, y, id, data, Extra_when, Extra_vodimg, force_VOD) {
    if (!data[1]) data[1] = data[6];
    var div = document.createElement('div');

    div.setAttribute('id', UserLiveFeed_ids[3] + id);
    UserLiveFeed_DataObj[pos][y] = data;

    div.className = 'user_feed_thumb';

    var image = (force_VOD ? Extra_vodimg : (data[0].replace("{width}x{height}", Main_VideoSize) + Main_randomimg)),
        ishosting = data[16];

    div.innerHTML = '<div id="' + UserLiveFeed_ids[0] + id + '" class="stream_thumbnail_player_feed"><div class="stream_thumbnail_live_img"><img id="' +
        UserLiveFeed_ids[1] + id + '" class="stream_img" alt="" src="' + image + '" onerror="this.onerror=null;this.src=\'' + IMG_404_VOD +
        '\';" ></div><div class="stream_thumbnail_feed_text_holder"><div class="stream_text_holder"><div style="line-height: 2vh; transform: translateY(10%);"><div id="' +
        UserLiveFeed_ids[2] + id + '" class="stream_info_live_name" style="width:' +
        (ishosting ? '99%; max-height: 2.4em; white-space: normal;' : '63.5%; white-space: nowrap; text-overflow: ellipsis;') + ' display: inline-block; overflow: hidden;">' +
        '<i class="icon-' + (data[8] ? 'refresh' : 'circle') + ' live_icon strokedeline' + (force_VOD ? ' hideimp' : '') + '" style="color: ' +
        (data[8] ? '#FFFFFF' : ishosting ? '#FED000' : 'red') + ';"></i> ' +
        (Extra_vodimg || force_VOD ? ('<div class="vodicon_text ' + (force_VOD ? '' : 'hideimp') + '" style="background: #00a94b;">&nbsp;&nbsp;VOD&nbsp;&nbsp;</div>&nbsp;') :
            '<div style="display: none;"></div>') + //empty div to prevent error when childNodes[2].classList.remove
        data[1] + '</div><div class="stream_info_live" style="width:' + (ishosting ? 0 : 36) +
        '%; float: right; text-align: right; display: inline-block; font-size: 70%;">' +
        data[5] + '</div></div><div class="' + (Extra_when ? 'stream_info_live_title_single_line' : 'stream_info_live_title') +
        '">' + Main_ReplaceLargeFont(twemoji.parse(data[2])) +
        '</div><div class="stream_info_live">' + (data[3] !== "" ? STR_PLAYING + data[3] : "") +
        '</div><div id="' + UserLiveFeed_ids[4] + id + '" class="stream_info_live">' + STR_SINCE + data[11] + STR_SPACE_HTML + STR_FOR + data[4] + STR_SPACE_HTML + STR_VIEWER + '</div>' +
        (Extra_when ? ('<div class="stream_info_live">' + STR_WATCHED + Main_videoCreatedAtWithHM(Extra_when) + STR_BR +
            STR_UNTIL + Play_timeMs(Extra_when - (new Date(data[12]).getTime())) + '</div>') : '') +
        '</div></div></div>';

    return div;
}

function UserLiveFeedobj_CreatVodFeed(pos, x, id, data, Extra_when, Extra_until) {
    var div = document.createElement('div');

    div.setAttribute('id', UserLiveFeed_ids[3] + id);
    UserLiveFeed_DataObj[pos][x] = data;

    div.className = 'user_feed_thumb';

    div.innerHTML = '<div id="' + UserLiveFeed_ids[0] + id +
        '" class="stream_thumbnail_player_feed"><div class="stream_thumbnail_live_img"><img id="' + UserLiveFeed_ids[1] + id + '" class="stream_img" alt="" src="' + data[0] +
        '" onerror="this.onerror=null;this.src=\'' + IMG_404_VOD +
        '\';"><div id="' + UserLiveFeed_ids[4] + id + '" class="vod_watched" style="width: ' + (Main_history_Watched_Obj[data[7]] ? Main_history_Watched_Obj[data[7]] : 0) +
        '%;"></div></div><div class="stream_thumbnail_feed_text_holder"><div class="stream_text_holder"><div style="line-height: 2vh; transform: translateY(10%);"><div id="' +
        UserLiveFeed_ids[2] + id + '" class="stream_info_live_name" style="width:63.5%; white-space: nowrap; text-overflow: ellipsis; display: inline-block; overflow: hidden;">' +
        '<i class="icon-circle live_icon strokedeline" style="color: #00a94b;"></i> ' + data[1] +
        '</div><div class="stream_info_live" style="width:36%; float: right; text-align: right; display: inline-block; font-size: 70%;">' +
        data[5] + '</div></div><div class="' + (Extra_when ? 'stream_info_live_title_single_line' : 'stream_info_live_title') +
        '">' + data[10] + '</div>' + '<div class="stream_info_live">' + (data[3] !== "" && data[3] !== null ? STR_STARTED + STR_PLAYING + data[3] : "") + '</div>' +
        '<div style="line-height: 2vh;"><div class="stream_info_live" style="width: 74%; display: inline-block;">' + STR_STREAM_ON + data[2] +
        '</div><div class="stream_info_live" style="width: 26%; display: inline-block; float: right; text-align: right;">' +
        Play_timeS(data[11]) + '</div></div><div class="stream_info_live_title" style="font-family: \'Roboto\';">' +
        data[4] + STR_VIEWS + (Extra_when ? (', ' + STR_WATCHED + Main_videoCreatedAtWithHM(Extra_when) + STR_SPACE_HTML +
            STR_UNTIL + Play_timeS(Extra_until)) : '') + '</div></div></div>';

    return div;
}

function UserLiveFeedobj_CreatGameFeed(pos, x, id, data) {
    var div = document.createElement('div');
    data[14] = data[2];//To make Main_values.UserLiveFeed_LastPositionId work

    div.setAttribute('id', UserLiveFeed_ids[3] + id);
    UserLiveFeed_DataObj[pos][x] = data;

    div.className = 'user_feed_thumb_game';
    div.innerHTML = '<div id="' + UserLiveFeed_ids[0] + id +
        '" class="stream_thumbnail_game_feed"><div class="stream_thumbnail_feed_game"><img id="' +
        UserLiveFeed_ids[1] + id + '" class="stream_img" alt="" src="' +
        data[3].replace("{width}x{height}", Main_GameSize) + '" onerror="this.onerror=null;this.src=\'' +
        IMG_404_GAME + '\';"></div><div class="stream_thumbnail_game_feed_text_holder"><div class="stream_text_holder"><div id="' +
        UserLiveFeed_ids[2] + id + '" class="stream_info_game_name">' + data[0] + '</div>' +
        (data[1] !== '' ? '<div class="stream_info_live" style="width: 100%; display: inline-block;">' + data[1] + '</div>' : '') +
        '</div></div></div>';

    return div;
}

//Base video fun
function UserLiveFeedobj_loadDataSuccess(responseText) {
    //Main_Log('UserLiveFeedobj_loadDataSuccess');

    var response = JSON.parse(responseText),
        response_items,
        sorting = Settings_Obj_default('live_feed_sort'),
        stream, id, mArray,
        i = 0,
        itemsCount = UserLiveFeed_itemsCount[UserLiveFeedobj_UserLivePos];

    response = response.streams;
    response_items = response.length;

    if (response_items) {

        var sorting_type1 = UserLiveFeedobj_FeedSort[sorting][0],
            sorting_type2 = UserLiveFeedobj_FeedSort[sorting][1],
            sorting_direction = UserLiveFeedobj_FeedSort[sorting][2];

        if (sorting_direction) {
            //A-Z
            if (sorting_type1) {
                response.sort(function(a, b) {
                    return (a[sorting_type1][sorting_type2] < b[sorting_type1][sorting_type2] ? -1 :
                        (a[sorting_type1][sorting_type2] > b[sorting_type1][sorting_type2] ? 1 : 0));
                });
            } else {
                response.sort(function(a, b) {
                    return (a[sorting_type2] < b[sorting_type2] ? -1 :
                        (a[sorting_type2] > b[sorting_type2] ? 1 : 0));
                });
            }
        } else {
            //Z-A
            if (sorting_type1) {
                response.sort(function(a, b) {
                    return (a[sorting_type1][sorting_type2] > b[sorting_type1][sorting_type2] ? -1 :
                        (a[sorting_type1][sorting_type2] < b[sorting_type1][sorting_type2] ? 1 : 0));
                });
            } else {
                response.sort(function(a, b) {
                    return (a[sorting_type2] > b[sorting_type2] ? -1 :
                        (a[sorting_type2] < b[sorting_type2] ? 1 : 0));
                });
            }
        }

        for (i; i < response_items; i++) {
            stream = response[i];
            id = stream.channel._id;

            if (!UserLiveFeed_idObject[UserLiveFeedobj_UserLivePos].hasOwnProperty(id)) {

                UserLiveFeed_idObject[UserLiveFeedobj_UserLivePos][id] = itemsCount;
                mArray = ScreensObj_LiveCellArray(stream);
                UserLiveFeed_PreloadImgs.push(mArray[0]);

                UserLiveFeed_cell[UserLiveFeedobj_UserLivePos][itemsCount] =
                    UserLiveFeedobj_CreatFeed(
                        UserLiveFeedobj_UserLivePos,
                        itemsCount,
                        UserLiveFeedobj_UserLivePos + '_' + itemsCount,
                        mArray
                    );

                Sidepannel_Html +=
                    UserLiveFeedobj_CreatSideFeed(
                        itemsCount,
                        mArray
                    );

                itemsCount++;
            }
        }

    } else UserLiveFeedobj_Empty(UserLiveFeedobj_UserLivePos);

    Main_innerHTMLWithEle(Sidepannel_ScroolDoc, Sidepannel_Html);

    // UserLiveFeed_cell[UserLiveFeedobj_UserLivePos][itemsCount] =
    //     UserLiveFeedobj_CreatFeed(UserLiveFeedobj_UserLivePos + '_' + itemsCount,
    //         [
    //             IMG_404_VIDEO,
    //             "offlineteste",
    //             "title",
    //             "game",
    //             "for 1000 Viewers",
    //             "1440p90 [EN]",
    //             "offlineteste",
    //             10000000000,
    //             true,
    //             IMG_404_LOGO,
    //             true,
    //             "Since 11:04:36&nbsp;",
    //             "2020-01-25T09:49:05Z",
    //             1000,
    //             35618666]
    //     );
    // itemsCount++;

    UserLiveFeed_itemsCount[UserLiveFeedobj_UserLivePos] = itemsCount;

    Main_setTimeout(
        function() {

            UserLiveFeedobj_SetLastPosition(UserLiveFeedobj_UserLivePos);

            Sidepannel_Positions = JSON.parse(JSON.stringify(UserLiveFeed_idObject[UserLiveFeedobj_UserLivePos]));
            if (Sidepannel_Positions.hasOwnProperty(Main_values.UserSidePannel_LastPositionId)) {

                Sidepannel_PosFeed = Sidepannel_Positions[Main_values.UserSidePannel_LastPositionId];

            } else {

                Sidepannel_FindClosest();

            }


            Sidepannel_PreloadImgs();
            UserLiveFeed_loadDataSuccessFinish(UserLiveFeedobj_UserLivePos);

            if (Settings_notification_check_any_enable()) OSInterface_RunNotificationService();
        },
        25
    );
}

function UserLiveFeedobj_SetLastPosition(pos) {

    var total = UserLiveFeed_GetSize(pos);

    if (UserLiveFeed_idObject[pos].hasOwnProperty(Main_values.UserLiveFeed_LastPositionId[pos])) {

        UserLiveFeed_FeedPosY[pos] = UserLiveFeed_idObject[pos][Main_values.UserLiveFeed_LastPositionId[pos]];

    } else if (Main_values.UserLiveFeed_LastPosition[pos] && total) {

        var i = Main_values.UserLiveFeed_LastPosition[pos];

        for (i; i >= 0; i--) {

            if (UserLiveFeed_cell[pos][i]) {

                UserLiveFeed_FeedPosY[pos] = i;
                break;
            }

        }

    }

    //There is max total loaded positions, the scroll function only works well if there is at least 4 ahead
    //Give 5 to make things work
    if (UserLiveFeed_obj[pos].HasMore && (UserLiveFeed_FeedPosY[pos] > (total - 5)) && (total - 5) >= 0) {

        UserLiveFeed_FeedPosY[pos] = total - 5;

    }

}

//User VOD Start
var UserLiveFeedobj_VodFeedOldUserName = '';
function UserLiveFeedobj_ShowUserVod() {
    UserLiveFeedobj_SetBottomText(UserLiveFeedobj_UserVodPos - 2);

    if (AddUser_UserIsSet()) {
        UserLiveFeedobj_ShowFeedCheck(UserLiveFeedobj_UserVodPos, (UserLiveFeedobj_VodFeedOldUserName !== AddUser_UsernameArray[0].name));
        UserLiveFeedobj_VodFeedOldUserName = AddUser_UsernameArray[0].name;
    }
}

function UserLiveFeedobj_HideUserVod() {
    UserLiveFeed_CheckIfIsLiveSTop();
    UserLiveFeed_obj[UserLiveFeedobj_UserVodPos].div.classList.add('hide');
}

function UserLiveFeedobj_UserVod() {
    if (!UserLiveFeed_obj[UserLiveFeedobj_UserVodPos].loadingMore) UserLiveFeedobj_StartDefault(UserLiveFeedobj_UserVodPos);
    UserLiveFeedobj_loadUserVod();
}

function UserLiveFeedobj_loadUserVod() {
    UserLiveFeedobj_loadUserVodGet(
        Main_kraken_api + 'videos/followed?limit=100&broadcast_type=archive&sort=time&offset=' +
        UserLiveFeed_obj[UserLiveFeedobj_UserVodPos].offset + Main_TwithcV5Flag
    );
}

function UserLiveFeedobj_loadUserVodGet(theUrl) {

    FullxmlHttpGet(
        theUrl,
        Main_GetHeader(3, Main_OAuth + AddUser_UsernameArray[0].access_token),
        UserLiveFeedobj_loadUserVodGetEnd,
        noop_fun,
        UserLiveFeedobj_UserVodPos,
        UserLiveFeedobj_UserVodPos,
        null,
        null
    );

}

function UserLiveFeedobj_loadUserVodGetEnd(xmlHttp) {

    //Main_Log('UserLiveFeedobj_loadUserVodGetEnd ' + xmlHttp.status);
    if (xmlHttp.status === 200) {
        UserLiveFeedobj_loadDataBaseVodSuccess(xmlHttp.responseText, UserLiveFeedobj_UserVodPos);
    } else if (UserLiveFeed_token && (xmlHttp.status === 401 || xmlHttp.status === 403)) { //token expired
        //Token has change or because is new or because it is invalid because user delete in twitch settings
        // so callbackFuncOK and callbackFuncNOK must be the same to recheck the token

        if (AddUser_UserIsSet() && AddUser_UsernameArray[0].access_token) AddCode_refreshTokens(0, UserLiveFeedobj_loadUserVod, UserLiveFeedobj_loadDataError, UserLiveFeedobj_UserVodPos);
        else UserLiveFeedobj_loadDataError(UserLiveFeedobj_UserVodPos);

    } else {
        UserLiveFeedobj_loadDataError(UserLiveFeedobj_UserVodPos);
    }

}

function UserLiveFeedobj_loadDataBaseVodSuccess(responseText, pos) {

    var response = JSON.parse(responseText),
        response_items,
        id, mArray,
        i = 0,
        itemsCount = UserLiveFeed_itemsCount[pos];

    //return;

    response = response.videos;
    response_items = response.length;

    if (response_items) {

        for (i; i < response_items; i++) {
            mArray = ScreensObj_VodCellArray(response[i]);
            id = mArray[7];

            if (!UserLiveFeed_idObject[pos].hasOwnProperty(id)) {

                UserLiveFeed_idObject[pos][id] = itemsCount;

                // if (Main_A_includes_B(mArray[0] + '', '404_processing')) {
                //     mArray[0] = 'https://static-cdn.jtvnw.net/s3_vods/' + mArray[8].split('/')[3] +
                //         '/thumb/thumb0-' + Main_VideoSize + '.jpg'
                // }

                UserLiveFeed_cell[pos][itemsCount] =
                    UserLiveFeedobj_CreatVodFeed(
                        pos,
                        itemsCount,
                        pos + '_' + itemsCount,
                        mArray
                    );

                itemsCount++;
            }
        }

    } else UserLiveFeedobj_Empty(pos);

    UserLiveFeed_itemsCount[pos] = itemsCount;

    if (UserLiveFeed_obj[pos].HasMore) {

        UserLiveFeed_obj[pos].offset = UserLiveFeed_cell[pos].length;

        if (!response_items || response_items < (Main_ItemsLimitMax - 5)) UserLiveFeed_obj[pos].dataEnded = true;

    }

    if (UserLiveFeed_obj[pos].loadingMore) {

        UserLiveFeed_obj[pos].loadingMore = false;
        if (pos === UserLiveFeed_FeedPosX) UserLiveFeed_CounterDialog(UserLiveFeed_FeedPosY[pos], UserLiveFeed_itemsCount[pos]);

    } else {
        Main_setTimeout(
            function() {

                UserLiveFeedobj_SetLastPosition(pos);

                UserLiveFeed_loadDataSuccessFinish(pos);
            },
            25
        );
    }
}
//User VOD end

//User VOD history
function UserLiveFeedobj_ShowUserVodHistory() {
    UserLiveFeedobj_SetBottomText(UserLiveFeedobj_UserVodHistoryPos - 2);

    if (AddUser_UserIsSet()) {
        UserLiveFeedobj_ShowFeedCheck(UserLiveFeedobj_UserVodHistoryPos, true);
    }
}

function UserLiveFeedobj_HideUserVodHistory() {
    UserLiveFeed_CheckIfIsLiveSTop();
    UserLiveFeed_obj[UserLiveFeedobj_UserVodHistoryPos].div.classList.add('hide');
}

function UserLiveFeedobj_UserVodHistory() {
    UserLiveFeedobj_StartDefault(UserLiveFeedobj_UserVodHistoryPos);

    var array = Main_values_History_data[AddUser_UsernameArray[0].id].vod;

    array.sort(
        function(a, b) {
            return (a.date > b.date ? -1 : (a.date < b.date ? 1 : 0));
        }
    );

    var pos = UserLiveFeedobj_UserVodHistoryPos,
        response = JSON.parse(JSON.stringify(array.slice(0, 100))),// first 100 only
        len = response.length,
        response_items = Math.min(len, 100),
        cell, id,
        i = 0,
        itemsCount = UserLiveFeed_itemsCount[pos];

    if (response_items) {

        for (i; i < response_items; i++) {
            cell = response[i];
            id = cell.data[7];

            if (!UserLiveFeed_idObject[pos].hasOwnProperty(id)) {

                UserLiveFeed_idObject[pos][id] = itemsCount;

                UserLiveFeed_cell[pos][itemsCount] =
                    UserLiveFeedobj_CreatVodFeed(
                        pos,
                        itemsCount,
                        pos + '_' + itemsCount,
                        cell.data,
                        cell.date,
                        cell.watched
                    );

                itemsCount++;
            }
        }

        if (!itemsCount) UserLiveFeedobj_Empty(pos);
    } else UserLiveFeedobj_Empty(pos);

    UserLiveFeed_itemsCount[pos] = itemsCount;

    UserLiveFeedobj_SetLastPosition(pos);

    UserLiveFeed_loadDataSuccessFinish(pos);
}
//User VOD history end

function UserLiveFeedobj_loadDataBaseLiveSuccess(responseText, pos, game) {
    var responseObj = JSON.parse(responseText),
        total = responseObj._total,
        itemsCount = UserLiveFeed_itemsCount[pos],
        response = responseObj[UserLiveFeed_obj[pos].StreamType];

    if (game) {
        var key = Main_aGame;

        if (UserLiveFeed_obj[pos].data[game]) {

            UserLiveFeed_obj[pos].data[game].push.apply(UserLiveFeed_obj[pos].data[game], response);

        } else {

            UserLiveFeed_obj[pos].data[game] = response;

        }

        ScreenObj[key].setBackupData(
            responseObj,
            UserLiveFeed_obj[pos].data[game],
            UserLiveFeed_lastRefresh[pos],
            game,
            UserLiveFeed_obj[pos].ContentLang,
            UserLiveFeed_obj[pos].Lang
        );

    }

    UserLiveFeedobj_loadDataBaseLiveSuccessEnd(
        response,
        total,
        pos,
        itemsCount,
        game
    );

}

function UserLiveFeedobj_loadDataBaseLiveSuccessEnd(response, total, pos, itemsCount, game) {

    var response_items = response.length,
        stream,
        id,
        mArray,
        i = 0;

    if (response_items) {
        if (pos === UserLiveFeedobj_FeaturedPos) {
            var sorting = Settings_Obj_default('live_feed_sort');

            var sorting_type1 = UserLiveFeedobj_FeedSort[sorting][0],
                sorting_type2 = UserLiveFeedobj_FeedSort[sorting][1],
                sorting_direction = UserLiveFeedobj_FeedSort[sorting][2];

            if (sorting_direction) {
                //A-Z
                if (sorting_type1) {
                    response.sort(function(a, b) {
                        return (a.stream[sorting_type1][sorting_type2] < b.stream[sorting_type1][sorting_type2] ? -1 :
                            (a.stream[sorting_type1][sorting_type2] > b.stream[sorting_type1][sorting_type2] ? 1 : 0));
                    });
                } else {
                    response.sort(function(a, b) {
                        return (a.stream[sorting_type2] < b.stream[sorting_type2] ? -1 :
                            (a.stream[sorting_type2] > b.stream[sorting_type2] ? 1 : 0));
                    });
                }
            } else {
                //Z-A
                if (sorting_type1) {
                    response.sort(function(a, b) {
                        return (a.stream[sorting_type1][sorting_type2] > b.stream[sorting_type1][sorting_type2] ? -1 :
                            (a.stream[sorting_type1][sorting_type2] < b.stream[sorting_type1][sorting_type2] ? 1 : 0));
                    });
                } else {
                    response.sort(function(a, b) {
                        return (a.stream[sorting_type2] > b.stream[sorting_type2] ? -1 :
                            (a.stream[sorting_type2] < b.stream[sorting_type2] ? 1 : 0));
                    });
                }
            }
        }

        for (i; i < response_items; i++) {
            stream = UserLiveFeed_obj[pos].cell(response[i]);
            id = stream.channel._id;
            if (!UserLiveFeed_idObject[pos].hasOwnProperty(id)) {

                UserLiveFeed_idObject[pos][id] = itemsCount;
                mArray = ScreensObj_LiveCellArray(stream);

                UserLiveFeed_cell[pos][itemsCount] =
                    UserLiveFeedobj_CreatFeed(
                        pos,
                        itemsCount,
                        pos + '_' + itemsCount,
                        mArray
                    );

                itemsCount++;
            }
        }

    } else UserLiveFeedobj_Empty(pos);

    UserLiveFeed_itemsCount[pos] = itemsCount;

    UserLiveFeedobj_loadDataBaseLiveSuccessFinish(pos, total, response_items);

    if (response_items && game) {

        UserLiveFeedobj_loadDataBaseLiveBackup(pos, game);

    }
}

function UserLiveFeedobj_loadDataBaseLiveBackup(pos, game) {

    UserLiveFeed_obj[pos].idObjectBackup[game] = JSON.parse(JSON.stringify(UserLiveFeed_idObject[pos]));
    UserLiveFeed_obj[pos].DataObjBackup[game] = JSON.parse(JSON.stringify(UserLiveFeed_DataObj[pos]));
    UserLiveFeed_obj[pos].cellBackup[game] = Main_Slice(UserLiveFeed_cell[pos]);

}

function UserLiveFeedobj_loadDataBaseLiveSuccessFinish(pos, total, response_items) {

    if (UserLiveFeed_obj[pos].HasMore) {

        UserLiveFeed_obj[pos].offset = UserLiveFeed_cell[pos].length;
        UserLiveFeed_obj[pos].MaxOffset = total;

        if (!response_items) {

            UserLiveFeed_obj[pos].dataEnded = true;

        } else if (UserLiveFeed_obj[pos].MaxOffset === null ||
            typeof UserLiveFeed_obj[pos].MaxOffset === 'undefined') {

            if (response_items < 90) {

                UserLiveFeed_obj[pos].dataEnded = true;

            }

        } else {


            if (UserLiveFeed_obj[pos].offset >= total) UserLiveFeed_obj[pos].dataEnded = true;

        }

    }

    if (UserLiveFeed_obj[pos].loadingMore) {
        UserLiveFeed_obj[pos].loadingMore = false;
        if (pos === UserLiveFeed_FeedPosX) UserLiveFeed_CounterDialog(UserLiveFeed_FeedPosY[pos], UserLiveFeed_itemsCount[pos]);
    } else {
        Main_setTimeout(
            function() {

                UserLiveFeedobj_SetLastPosition(pos);

                UserLiveFeed_loadDataSuccessFinish(pos);
            },
            25
        );
    }
}
//Base video fun end

//Base game fun
function UserLiveFeedobj_loadDataBaseGamesSuccess(responseText, pos, type) {
    var responseObj = JSON.parse(responseText),
        total = responseObj._total,
        itemsCount = UserLiveFeed_itemsCount[pos],
        response = responseObj[type];

    UserLiveFeedobj_loadDataGamesSuccessEnd(
        response,
        total,
        pos,
        itemsCount
    );

}

function UserLiveFeedobj_loadDataGamesSuccessEnd(response, total, pos, itemsCount) {
    var response_items = response.length,
        cell,
        game,
        i = 0;

    if (response_items) {

        // if (pos === UserLiveFeedobj_UserGamesPos) {
        //     var sorting = Settings_Obj_default('game_feed_sort');

        //     var sorting_type1 = UserLiveFeedobj_FeedSortGames[sorting][0],
        //         sorting_type2 = UserLiveFeedobj_FeedSortGames[sorting][1],
        //         sorting_direction = UserLiveFeedobj_FeedSortGames[sorting][2];

        //     if (sorting_direction) {
        //         //A-Z
        //         if (sorting_type1) {
        //             response.sort(function(a, b) {
        //                 return (a[sorting_type1][sorting_type2] < b[sorting_type1][sorting_type2] ? -1 :
        //                     (a[sorting_type1][sorting_type2] > b[sorting_type1][sorting_type2] ? 1 : 0));
        //             });
        //         } else {
        //             response.sort(function(a, b) {
        //                 return (a[sorting_type2] < b[sorting_type2] ? -1 :
        //                     (a[sorting_type2] > b[sorting_type2] ? 1 : 0));
        //             });
        //         }
        //     } else {
        //         //Z-A
        //         if (sorting_type1) {
        //             response.sort(function(a, b) {
        //                 return (a[sorting_type1][sorting_type2] > b[sorting_type1][sorting_type2] ? -1 :
        //                     (a[sorting_type1][sorting_type2] < b[sorting_type1][sorting_type2] ? 1 : 0));
        //             });
        //         } else {
        //             response.sort(function(a, b) {
        //                 return (a[sorting_type2] > b[sorting_type2] ? -1 :
        //                     (a[sorting_type2] < b[sorting_type2] ? 1 : 0));
        //             });
        //         }
        //     }
        // }

        var isntUser = pos !== UserLiveFeedobj_UserGamesPos;

        for (i; i < response_items; i++) {
            cell = response[i];
            game = cell.game;

            if (!UserLiveFeed_idObject[pos].hasOwnProperty(game._id)) {

                UserLiveFeed_idObject[pos][game._id] = itemsCount;

                UserLiveFeed_cell[pos][itemsCount] =
                    UserLiveFeedobj_CreatGameFeed(
                        pos,
                        itemsCount,
                        pos + '_' + itemsCount,
                        [
                            game.name,//0
                            isntUser ? Main_addCommas(cell.channels) + STR_SPACE_HTML + STR_CHANNELS + STR_BR + STR_FOR +
                                Main_addCommas(cell.viewers) + STR_SPACE_HTML + STR_VIEWER : '',//1
                            game._id,//2
                            game.box.template//3
                        ]
                    );

                itemsCount++;
            }
        }
    } else UserLiveFeedobj_Empty(pos);

    UserLiveFeed_itemsCount[pos] = itemsCount;

    if (UserLiveFeed_obj[pos].HasMore) {
        UserLiveFeed_obj[pos].offset = UserLiveFeed_cell[pos].length;
        UserLiveFeed_obj[pos].MaxOffset = total;
        if (UserLiveFeed_obj[pos].offset >= total || !response_items)
            UserLiveFeed_obj[pos].dataEnded = true;
    }

    if (UserLiveFeed_obj[pos].loadingMore) {
        UserLiveFeed_obj[pos].loadingMore = false;
        if (pos === UserLiveFeed_FeedPosX) UserLiveFeed_CounterDialog(UserLiveFeed_FeedPosY[pos], UserLiveFeed_itemsCount[pos]);
    } else {
        Main_setTimeout(
            function() {

                UserLiveFeedobj_SetLastPosition(pos);

                UserLiveFeed_loadDataSuccessFinish(pos);
            },
            25
        );
    }

}
//Base game fun end

function UserLiveFeedobj_CheckOffset(pos) {
    if ((UserLiveFeed_obj[pos].offset >= 900) ||
        ((UserLiveFeed_obj[pos].MaxOffset !== null &&
            (typeof UserLiveFeed_obj[pos].MaxOffset !== 'undefined')) &&
            UserLiveFeed_obj[pos].offset &&
            (UserLiveFeed_obj[pos].offset + 100) > UserLiveFeed_obj[pos].MaxOffset)) {

        UserLiveFeed_obj[pos].dataEnded = true;

    }
}