const g_cntPages = 14;

let g_nDecimalsToShow = 2;
let g_nDecimalsToShow4Bytes = 0;

let g_nStatsDepth = 32;
let g_arrStats = [];
async function pushStats( joStats ) {
    if( !joStats )
        return;
    g_arrStats.push( joStats );
    while( g_arrStats.length > g_nStatsDepth )
        g_arrStats.shift();
    await do_expose_data();
}

function lastStats() {
    if( g_arrStats.length <= 0 )
        return null;
    try {
        return g_arrStats[ g_arrStats.length - 1 ];
    } catch ( err ) { }
    return null;
}

let g_idRawElement = 0;
function nextRawElementID( strPrefix ) {
    strPrefix = strPrefix || "idRawElement_";
    ++ g_idRawElement;
    return "" + strPrefix + g_idRawElement;
}

let g_idGenerator = 1;
let g_connection = null;
class SkaleConnection {
    constructor( strWeb3URL, fnOpenedHandler ) {
        fnOpenedHandler = fnOpenedHandler || function () { };
        this.mapCalls = { };
        this.strWeb3URL = "" + strWeb3URL;
        this.ws = null;
        if( is_ws_url( strWeb3URL ) ) {
            let ws = new WebSocket( "" + this.strWeb3URL );
            this.ws = ws;
            ws.skaleConnection = this;
            ws.onopen = function ( ev ) {
                console.log( "Opened from ws( " + ws.skaleConnection.strWeb3URL + " )" );
                //fnOpenedHandler();
                setTimeout( function () {
                    fn_periodic_refresher();
                    fnOpenedHandler();
                }, 1 );
            };
            ws.onmessage = function ( ev ) {
                //console.log( "Received from ws(" + ws.skaleConnection.strWeb3URL + "):", ev.data );
                let joAnswer = JSON.parse( ev.data );
                let id = "" + joAnswer.id;
                let fn = ws.skaleConnection.mapCalls[ id ];
                delete ws.skaleConnection.mapCalls[ id ];
                if( fn)
                    fn( joAnswer );
            }
        } else
            setTimeout( function () {
                fn_periodic_refresher();
                fnOpenedHandler();
            }, 1 );
    }
    stop() {
        if( this.ws ) {
            this.ws.close();
            this.ws = null;
        }
    }
    call( joQuery, fn ) {
        let id = 0;
        if( "id" in joQuery )
            id = "" + joQuery.id;
        else {
            if( g_idGenerator < 0 )
                g_idGenerator = 0;
            ++g_idGenerator;
            id = "" + g_idGenerator;
            joQuery.id = parseInt(id);
        }
        let strQuery = JSON.stringify( joQuery );
        fn = fn || function ( joAnswer ) { };
        let self = this;
        if( self.ws ) {
            if( self.ws.readyState != WebSocket.OPEN )
                throw "web socket is not in open state";
            self.mapCalls[ id ] = fn;
            //console.log( "Sending to ws(" + self.strWeb3URL + "):", strQuery );
            self.ws.send(strQuery );
        } else {
            //console.log( "AJAX to ws(" + self.strWeb3URL + "):", strQuery );
            $.ajax({
                "url": "" + self.strWeb3URL,
                "data": strQuery,
                "type": "POST",
                "contentType": "application/json; charset=utf-8",
                "dataType": "json",
                "success": function (data ) {
                    //console.log( "Received from AJAX( " + self.strWeb3URL + " ):", data );
                    fn(data );
                },
                "error": function ( err ) {
                    console.log( "Error from AJAX( " + self.strWeb3URL + " ):", err );
                }
            } );

        }
    }
} /// class SkaleConnection

function create_string_history_object() {
    let joHistory = {
        "h_": [],
        "isModified_": false,
        "max_": 20,
        "size": function () {
            return 0 + this.h_.length;
        },
        "get": function ( i ) {
            try {
                let s = "" + this.h_[ i ];
                return s;
            } catch ( e ) {
                return null;
            }
        },
        "indexOf": function ( what ) {
            let cnt = this.size();
            for( let i = 0; i < cnt; ++ i ) {
                let s = this.get( i );
                if( s == what )
                    return i;
            }
            return -1;
        },
        "clear": function ( what ) {
            let cntRemoved = 0;
            if( what == undefined || what == null || what == "" ) {
                cntRemoved = this.h_.length;
                this.h_ = [];
                this.setModified( true );
                return cntRemoved;
            } // clear all
            while( true ) {
                let i = this.indexOf( what );
                if( i < 0 )
                    break;
                this.h_.splice( i, 1 );
                ++cntRemoved;
            }
            return cntRemoved;
        },
        "push": function ( what ) {
            if( what == undefined || what == null || what == "" )
                return false;
            let idxFound = this.indexOf( what );
            if( idxFound == 0 )
                return false;
            if( idxFound > 0 )
                this.h_.splice(idxFound, 1 ); // remove, will re-insert
            this.h_.splice(0, 0, "" + what.toString() ); //this.h_.push( "" + what.toString() );
            if( this.max_ > 0 ) {
                let n = this.h_.length;
                if( n > this.max_)
                    this.h_.splice(this.max_ - n);
            }
            this.setModified( true );
            return true;
        },
        "setModified": function ( b ) {
            this.isModified_ = b ? true : false;
        },
        "isModified": function () {
            return this.isModified_ ? true : false;
        },
        "each": function ( fn ) {
            if( fn == undefined || fn == null || ( ! ( typeof fn == "function" ) ) )
                return 0;
            let cnt = this.size(),
                cntPass = 0;
            for( let i = 0; i < cnt; ++ i ) {
                let s = this.get( i );
                if( !fn(s, i, cnt ) )
                    break;
                ++cntPass;
            }
            return cntPass;
        },
        "load": function ( strName ) {
            this.setModified( true );
            this.h_ = store.get( strName );
            if( !( typeof this.h_ == "array" || typeof this.h_ == "object" ) )
                this.h_ = [];
        },
        "save": function ( strName ) {
            store.set(strName, this.h_ );
        }
    };
    return joHistory;
}
let joHistoryURLs = create_string_history_object();

JSON.stringifyOnce = function ( obj, replacer, indent ) {
    let printedObjects = [];
    let printedObjectKeys = [];

    function printOnceReplacer( key, value ) {
        if( printedObjects.length > 2000 ) { // browsers will not print more than 20K, I do not see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
            return "object too long";
        }
        let printedObjIndex = false;
        printedObjects.forEach( function ( obj, index ) {
            if( obj === value ) {
                printedObjIndex = index;
            }
        } );
        if( key == "" ) { // root element
            printedObjects.push( obj);
            printedObjectKeys.push( "root" );
            return value;
        } else if( printedObjIndex + "" != "false" && typeof( value ) == "object" ) {
            if( printedObjectKeys[printedObjIndex] == "root" ) {
                return "(pointer to root)";
            } else {
                return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase() : typeof( value ) ) + " with key " + printedObjectKeys[printedObjIndex] + ")";
            }
        } else {
            let qualifiedKey = key || "(empty key)";
            printedObjects.push( value );
            printedObjectKeys.push( qualifiedKey );
            if( replacer) {
                return replacer( key, value );
            } else {
                return value;
            }
        }
    }
    return JSON.stringify( obj, printOnceReplacer, indent );
};

async function async_document_ready_handler() {
    g_performanceTimeline.update_ui();

    $( "#idServerInput" ).keydown( function ( event ) {
        let keyPressed = event.keyCode || event.which;
        if( keyPressed == 13 )
            $( "#idServerButton" ).click();
    } );
    //
    //
    // clearable text inputs
    function tog(v) {
        return v ? "addClass" : "removeClass";
    }
    $(document).on( "input", ".clearable", function () {
        $(this )[ tog( this.value ) ] ( "x" );
    }).on( "mousemove", ".x", function ( e ) {
        $(this )[ tog( this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left ) ]( "onX" );
    }).on( "touchstart click", ".onX", function ( ev ) {
        ev.preventDefault();
        $(this ).removeClass( "x onX" ).val( "" ).change();
    } );
    // $( ".clearable" ).trigger( "input" );
    // Uncomment the line above if you pre-fill values from LS or server
    $( "#idServerInput" ).webuiPopover( {
        "url": "#idServerHistoryPopover",
        "trigger": "hover"
    } );
    //

    create_transaction_flow_page();

    //
    joHistoryURLs.load( "history_urls" );
    joHistoryURLs.setModified( false );
    let nViewMode = parseInt(store.get( "view_mode" ) );
    if( nViewMode == null || nViewMode == undefined || nViewMode <= 0 || nViewMode > g_cntPages )
        nViewMode = 1;
    $( "#idViewSelect" ).val( nViewMode );
    //
    let nUpdateIntervalMS = parseInt(store.get( "update_interval" ) );
    if( nUpdateIntervalMS == null || nUpdateIntervalMS == undefined || nUpdateIntervalMS < 500 )
        nUpdateIntervalMS = 500;
    $( "#idUpdateInterval" ).val( nUpdateIntervalMS );

    //
    await do_connect( get_web3_url_string(), true );
}
$( function () {
    async_document_ready_handler();
} ); // we would like to handle document\"s "ready" event in an async manner)

function update_recent_servers() {
    WebuiPopovers.hideAll();
    // idServerRecentEntries
    let po = $( "#idServerRecentEntries" );
    let strHTML = "<br /><h4 class=\"white\"><nobr>Recent Servers:</nobr></h4>";
    let cnt = joHistoryURLs.size();
    for( let i = 0; i < cnt; ++ i ) {
        let strItem = joHistoryURLs.get( i );
        let s = "<br /><nobr><a href=\"javascript: do_connect(\"" + strItem + "\");\">" + strItem + "<nobr>";
        strHTML += s;
    }
    if( cnt == 0 )
        strHTML += "<br /><br /><nobr><span class=\"helper-comment\">empty</span>";
    po.html(strHTML);
}

function onChangeUpdateInterval() {
    let nUpdateIntervalMS = parseInt($( "#idUpdateInterval" ).val() );
    if( nUpdateIntervalMS == null || nUpdateIntervalMS == undefined || nUpdateIntervalMS < 500 )
        nUpdateIntervalMS = 500;
    store.set( "update_interval", nUpdateIntervalMS );
    fn_periodic_refresher();
}

function onChangeViewSelect() {
    let nViewMode = parseInt($( "#idViewSelect" ).val() );
    if( nViewMode == null || nViewMode == undefined || nViewMode <= 0 || nViewMode > g_cntPages )
        nViewMode = 1;
    store.set( "view_mode", nViewMode );
    do_refresh_data();
}

function is_ws_url( strWeb3URL ) {
    try {
        let u = new URL( strWeb3URL );
        if( u.protocol == "ws:" || u.protocol == "wss:" )
            return true;
    } catch ( err ) { }
    return false;
}

function get_web3_url_string() {
    let strWeb3URL = store.get( "server_url" );
    if( strWeb3URL == undefined || strWeb3URL == null || strWeb3URL == "" )
        strWeb3URL = "" + $( "#idServerInput" ).val();
    if( strWeb3URL.length == 0 )
        strWeb3URL = "ws://127.0.0.1:15020"; // "https://mainnet.infura.io"; // main-net
    return strWeb3URL;
}
async function do_connect( strWeb3URL, isForce ) {
    if( !joHistoryURLs.push( strWeb3URL ) ) {
        if( isForce !== true )
            return;
    }
    if( joHistoryURLs.isModified() ) {
        joHistoryURLs.save( "history_urls" );
        joHistoryURLs.setModified( false );
    }
    update_recent_servers();
    //            hide_properties();
    WebuiPopovers.hideAll();
    store.set( "server_url", "" + strWeb3URL);
    $( "#idServerInput" ).val( strWeb3URL ); // show in server URL editor
    // g_w3 = null;
    console.log( "Will connect to " + strWeb3URL);
    // if( is_ws_url( strWeb3URL ) )
    //     g_w3 = new Web3( new Web3.providers.WebsocketProvider( strWeb3URL ) );
    // else
    //     g_w3 = new Web3( new Web3.providers.HttpProvider( strWeb3URL ) );
    g_connection = new SkaleConnection( strWeb3URL, function () {
        do_refresh_data();
    } );
}

function clear_page_content( idxPage ) {
    $("#idPerformanceRecordingToolbar").css( { display: "none" } );
    let idPage = "#idContentPage" + idxPage;
    switch ( idxPage ) {
        case 1: // System Information
        case 2: // Raw General Statistics as JSON
        break;
        case 3: // RPC / Summary Performance
            $(idPage).html( "<no_data_panel>No <b>RPC performance</b> data available</no_data_panel>" );
        break;
        case 4: // RPC / All Subsystems
        case 5: // RPC / HTTP
        case 6: // RPC / HTTPS
        case 7: // RPC / WS
        case 8: { // RPC / WSS
            // let idTableBody = "#idStatsTable > tbody" + idxPage;
            // $(idTableBody).html( "" );
        } break;
        case 9: // Transaction State Diagram
        break;
        case 10: // Performance Timeline Tracker
            // g_performanceTimeline.destroy();
        break;
        case 11: // UN-DDOS / Summary
            $(idPage).html( "<no_data_panel>No <b>UN-DDOS / Summary</b> data available</no_data_panel>" );
        break;
        case 12: // UN-DDOS / RPC Counters
            // $(idPage).html( "<no_data_panel>No <b>UN-DDOS / RPC Counters</b> data available</no_data_panel>" );
        break;
        case 13: // UN-DDOS / WS/WSS Counters
            // $(idPage).html( "<no_data_panel>No <b>UN-DDOS / WS/WSS Counters</b> data available</no_data_panel>" );
        break;
        case 14: // Mining stats
        break;
        default:
            $(idPage).html( "" );
        break;
    }
}

function update_simple_sparkline( id_sparkline, arr ) {
    if( ! arr )
        return;
    while( arr.length < g_nStatsDepth )
        arr.splice(0, 0, 0 ); // inset 0 at beginning
    // https://omnipotent.net/jquery.sparkline/#s-docs
    let jqSparkline = $( "#" + id_sparkline );
    let clrSpot = "black";
    let clrLine = "#404040";
    let clrFill = "#9090FFFF";
    let fn = function () {
        jqSparkline.sparkline(
            arr, {
                type: "line",
                "lineColor": clrLine,
                "fillColor": clrFill,
                "defaultPixelsPerValue": 2,
                "spotColor": "#FF0000", //clrSpot
                "minSpotColor": clrSpot,
                "maxSpotColor": clrSpot,
                "highlightSpotColor": clrSpot,
                "highlightLineColor": clrSpot,
                // "tooltipFormat": "{{y:val}}",
                // "tooltipValueLookups": { "val": { "-1": "N/A" }}
                // "tooltipFormatter": function ( sp, options, fields ) {
                //     return "" + Number( fields.y ).toFixed( g_nDecimalsToShow ) + " " + strPropertyNameShort;
                // }
            } );
    };
    //fn();
    setTimeout( fn, 0 );
}

function extract_unddos_history_value( s ) {
    try {
        if( s == null || s == undefined )
            return 0;
        return parseInt( s );
    } catch( err ) {
        return 0;
    }
}

function extract_unddos_history_data( strOriginName, strSubsystemName, strPropertyName ) {
    const arr = [];
    for( const joHistoryEntry of g_arrStats ) {
        let n = 0;
        if( joHistoryEntry.unddos && joHistoryEntry.unddos[strSubsystemName] && joHistoryEntry.unddos[strSubsystemName][strOriginName] ) {
            try {
                n = extract_unddos_history_value( joHistoryEntry.unddos[strSubsystemName][strOriginName][strPropertyName] );
            } catch( err ) {
                n = 0;
            }
        }
        arr.push( n );
    }
    return arr;
}

const g_mapUnDdosRPC = {};
function helper_unddos_rpc_page_content( idxPage, joStats ) {
    if( (!joStats) || (!joStats.unddos) || (!joStats.unddos.calls) )
        return;
    const table = document.getElementById( "idStatsTable" + idxPage );
    const tbody = table.tBodies[0];
    const mapOrigins = joStats.unddos.calls;
    // add new
    for( let [ strOriginName, joOriginData ] of Object.entries( mapOrigins ) ) {
        let joOrigin = null, td = null;
        if( ! ( strOriginName in g_mapUnDdosRPC ) ) {
            tr = document.createElement( "tr" );
            tr.className = " stats_table";
            td = document.createElement( "td" ); // Origin name
            td.className += " stats_table";
            td.innerHTML = "" + strOriginName;
            tr.appendChild( td );
            td = document.createElement( "td" ); // Status
            td.className += " stats_table";
            tr.appendChild( td );
            td = document.createElement( "td" ); // Calls, p/s
            td.className += " stats_table right_td";
            tr.appendChild( td );
            td = document.createElement( "td" );
            td.className += " stats_table";
            tr.appendChild( td );
            td = document.createElement( "td" ); // last minute
            td.className += " stats_table right_td";
            tr.appendChild( td );
            td = document.createElement( "td" );
            td.className += " stats_table";
            tr.appendChild( td );
            tbody.appendChild( tr );
            joOrigin = {
                name: "" +  strOriginName
                , tr: tr
                , id_sparkline_cps: nextRawElementID( "id_unddos_sparkline_" + idxPage + "_" )
                , id_sparkline_cpm: nextRawElementID( "id_unddos_sparkline_" + idxPage + "_" )
            };
            g_mapUnDdosRPC[ strOriginName ] = joOrigin;
        } else {
            joOrigin = g_mapUnDdosRPC[ strOriginName ];
        }
        if( joOriginData.ban )
            $( tr ).addClass( "ban_row" );
        else
            $( tr ).removeClass( "ban_row" );
        let nCellIndex = 1; // Status
        td = joOrigin.tr.children[ nCellIndex ];
        td.innerHTML = joOriginData.ban ? "banned" : "working";
        ++ nCellIndex; // Calls, p/s
        td = joOrigin.tr.children[ nCellIndex ];
        td.innerHTML = extract_unddos_history_value( joOriginData.cps );
        ++ nCellIndex; // Calls, p/s, sparkline
        td = joOrigin.tr.children[ nCellIndex ];
        td.innerHTML = "<span class=\"spark_adjustment\" id=\"" + joOrigin.id_sparkline_cps + "\"></span>";
        ++ nCellIndex; // last minute
        td = joOrigin.tr.children[ nCellIndex ];
        td.innerHTML = extract_unddos_history_value( joOriginData.cpm );
        ++ nCellIndex; // last minute, sparkline
        td = joOrigin.tr.children[ nCellIndex ];
        td.innerHTML = "<span class=\"spark_adjustment\" id=\"" + joOrigin.id_sparkline_cpm + "\"></span>";
        update_simple_sparkline( joOrigin.id_sparkline_cps, extract_unddos_history_data( strOriginName, "calls", "cps" ) );
        update_simple_sparkline( joOrigin.id_sparkline_cpm, extract_unddos_history_data( strOriginName, "calls", "cpm" ) );
    }
    // remove old
    const arrOriginNamesToErase = [];
    for( let [ strOriginName, joOrigin ] of Object.entries( g_mapUnDdosRPC ) ) {
        if( strOriginName in mapOrigins )
            continue;
        arrOriginNamesToErase.push( strOriginName );
        if( joOrigin.tr ) {
            joOrigin.tr.remove();
            joOrigin.tr = null;
        }
    }
    for( const strOriginName of arrOriginNamesToErase )
        delete g_mapUnDdosRPC[ strOriginName ];
}

let g_gaugeMiningBlocksPerSecond = null;
let g_gaugeMiningTransactionsPerBlock = null;
let g_gaugeMiningTransactionsPerSecond = null;
let g_chartMiningBlocksPerSecond = null;
let g_chartMiningTransactionsPerBlock = null;
let g_chartMiningTransactionsPerSecond = null;
const g_nMaxMiningChartHistoryLength = 30;
const g_arrMiningHistoryBlocksPerSecond = [];
const g_arrMiningHistoryTransactionsPerBlock = [];
const g_arrMiningHistoryTransactionsPerSecond = [];

function helper_mining_page_content( idxPage, joStats ) {
    $( "div#idMiningBlocksPerSecond" ).html( joStats.blocks.blocksPerSecond.toFixed( 2 ) );
    $( "div#idMiningTransactionsPerBlock" ).html( joStats.blocks.transactionsPerBlock.toFixed( 2 ) );
    $( "div#idMiningTransactionsPerSecond" ).html( joStats.blocks.transactionsPerSecond.toFixed( 2 ) );

    if( ! g_gaugeMiningBlocksPerSecond )
        g_gaugeMiningBlocksPerSecond = find_gauge_by_element_id( "idGaugeMiningBlocksPerSecond" );
    if( ! g_gaugeMiningTransactionsPerBlock )
        g_gaugeMiningTransactionsPerBlock = find_gauge_by_element_id( "idGaugeMiningTransactionsPerBlock" );
    if( ! g_gaugeMiningTransactionsPerSecond )
        g_gaugeMiningTransactionsPerSecond = find_gauge_by_element_id( "idGaugeMiningTransactionsPerSecond" );

    g_gaugeMiningBlocksPerSecond.value = joStats.blocks.blocksPerSecond;
    g_gaugeMiningTransactionsPerBlock.value = joStats.blocks.transactionsPerBlock;
    g_gaugeMiningTransactionsPerSecond.value = joStats.blocks.transactionsPerSecond;

    if( g_chartMiningBlocksPerSecond == null )
        g_chartMiningBlocksPerSecond = new_mining_chart( "idChartMiningBlocksPerSecond", "Blocks per second" );
    if( g_chartMiningTransactionsPerBlock == null )
        g_chartMiningTransactionsPerBlock = new_mining_chart( "idChartMiningTransactionsPerBlock", "Transactions per block" );
    if( g_chartMiningTransactionsPerSecond == null )
        g_chartMiningTransactionsPerSecond = new_mining_chart( "idChartMiningTransactionsPerSecond", "Transactions per second" );
    append_to_mining_history_array( g_arrMiningHistoryBlocksPerSecond, joStats.blocks.blocksPerSecond );
    append_to_mining_history_array( g_arrMiningHistoryTransactionsPerBlock, joStats.blocks.transactionsPerBlock );
    append_to_mining_history_array( g_arrMiningHistoryTransactionsPerSecond, joStats.blocks.transactionsPerSecond );
    g_chartMiningBlocksPerSecond.data.datasets[0].data = g_arrMiningHistoryBlocksPerSecond;
    g_chartMiningBlocksPerSecond.update( 0 );
    g_chartMiningTransactionsPerBlock.data.datasets[0].data = g_arrMiningHistoryTransactionsPerBlock;
    g_chartMiningTransactionsPerBlock.update( 0 );
    g_chartMiningTransactionsPerSecond.data.datasets[0].data = g_arrMiningHistoryTransactionsPerSecond;
    g_chartMiningTransactionsPerSecond.update( 0 );
}

function append_to_mining_history_array( arr, val ) {
    arr.push( val );
    while( arr.length > g_nMaxMiningChartHistoryLength )
        arr.shift();
    return arr;
}

function new_mining_chart( element_id, strLabel ) {
    const ctx = document.getElementById( element_id ).getContext( "2d" );
    const chart = new Chart( ctx, {
        type: "line",
        data: {
            labels: create_mining_chart_labels_array(), // ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: strLabel,
                backgroundColor: "#808080",
                borderColor: "808080",
                fill: false,
                data: [] // [0, 10, 5, 2, 20, 30, 45]
            }]
        },
        options: {
            responsive: false
        }
    });
    return chart;
}

function create_mining_chart_labels_array() {
    const arr = [];
    for( let i = 0; i < g_nMaxMiningChartHistoryLength; ++ i )
        arr.push( " " );
    return arr;
}

function find_gauge_by_element_id( element_id ) {
    const arrGauges = document.gauges;
    for ( const gauge of arrGauges ) {
        if( gauge
            && "canvas" in gauge
            && gauge.canvas
            && "element" in gauge.canvas
            && gauge.canvas.element
            && "id" in gauge.canvas.element
            && gauge.canvas.element.id == element_id
            )
            return gauge;
    }
    return null;
}

const g_mapUnDdosWS = {};
function helper_unddos_ws_calls_page_content( idxPage, joStats ) {
    if( (!joStats) || (!joStats.unddos) || (!joStats.unddos.ws_conns) )
        return;
    const table = document.getElementById( "idStatsTable" + idxPage );
    const tbody = table.tBodies[0];
    const mapOrigins = joStats.unddos.ws_conns;
    // add new
    for( let [ strOriginName, joOriginData ] of Object.entries( mapOrigins ) ) {
        let joOrigin = null, td = null;
        if( ! ( strOriginName in g_mapUnDdosWS ) ) {
            tr = document.createElement( "tr" );
            tr.className = " stats_table";
            td = document.createElement( "td" ); // Origin name
            td.className += " stats_table";
            td.innerHTML = "" + strOriginName;
            tr.appendChild( td );
            td = document.createElement( "td" ); // Status
            td.className += " stats_table";
            tr.appendChild( td );
            td = document.createElement( "td" ); // Connections
            td.className += " stats_table right_td";
            tr.appendChild( td );
            td = document.createElement( "td" );
            td.className += " stats_table";
            tr.appendChild( td );
            tbody.appendChild( tr );
            joOrigin = {
                name: "" +  strOriginName
                , tr: tr
                , id_sparkline_connections: nextRawElementID( "id_unddos_sparkline_" + idxPage + "_" )
            };
            g_mapUnDdosWS[ strOriginName ] = joOrigin;
        } else {
            joOrigin = g_mapUnDdosWS[ strOriginName ];
        }
        if( joOriginData.ban )
            $( tr ).addClass( "ban_row" );
        else
            $( tr ).removeClass( "ban_row" );
        let nCellIndex = 1; // Status
        td = joOrigin.tr.children[ nCellIndex ];
        td.innerHTML = joOriginData.ban ? "banned" : "working";
        ++ nCellIndex; // Connections
        td = joOrigin.tr.children[ nCellIndex ];
        td.innerHTML = extract_unddos_history_value( joOriginData.cnt );
        ++ nCellIndex; // Connections, sparkline
        td = joOrigin.tr.children[ nCellIndex ];
        td.innerHTML = "<span class=\"spark_adjustment\" id=\"" + joOrigin.id_sparkline_connections + "\"></span>";
        update_simple_sparkline( joOrigin.id_sparkline_connections, extract_unddos_history_data( strOriginName, "ws_conns", "cnt" ) );
    }
    // remove old
    const arrOriginNamesToErase = [];
    for( let [ strOriginName, joOrigin ] of Object.entries( g_mapUnDdosWS ) ) {
        if( strOriginName in mapOrigins )
            continue;
        arrOriginNamesToErase.push( strOriginName );
        if( joOrigin.tr ) {
            joOrigin.tr.remove();
            joOrigin.tr = null;
        }
    }
    for( const strOriginName of arrOriginNamesToErase )
        delete g_mapUnDdosWS[ strOriginName ];
}

let map_tr_apis = {
    4: { },
    5: { },
    6: { },
    7: { },
    8: { }
};

function helper_get_rpc_extractor( idxPage ) {
    let fnExtractRPC = null;
    switch ( idxPage ) {
        case 4:
            fnExtractRPC = function ( jo ) {
                try {
                    return jo.rpc;
                } catch ( err ) {
                    return { };
                }
            };
            break;
        case 5:
            fnExtractRPC = function ( jo ) {
                try {
                    return jo.protocols.http.rpc;
                } catch ( err ) {
                    return { };
                }
            };
            break;
        case 6:
            fnExtractRPC = function ( jo ) {
                try {
                    return jo.protocols.https.rpc;
                } catch ( err ) {
                    return { };
                }
            };
            break;
        case 7:
            fnExtractRPC = function ( jo ) {
                try {
                    return jo.protocols.ws.rpc;
                } catch ( err ) {
                    return { };
                }
            };
            break;
        case 8:
            fnExtractRPC = function ( jo ) {
                try {
                    return jo.protocols.wss.rpc;
                } catch ( err ) {
                    return { };
                }
            };
            break;
    }
    return fnExtractRPC;
}

function helper_extract_api_history_arr( fnExtractRPC, strApiName ) {
    let i, cnt = g_arrStats.length,
        api_history_arr = [];
    for( i = 0; i < cnt; ++ i ) {
        let joRPC = fnExtractRPC(g_arrStats[ i ]);
        if( strApiName in joRPC)
            api_history_arr.push( joRPC[strApiName]);
    }
    return api_history_arr;
}

function helper_create_rpc_page_content( idxPage ) {
    let fnExtractRPC = helper_get_rpc_extractor( idxPage );
    if( fnExtractRPC == null )
        return;
    let apis_table = document.getElementById( "idStatsTable" + idxPage );
    let apis_table_tbody = apis_table.tBodies[0];

    let map_api_history = fnExtractRPC( lastStats() );
    let api_names = Object.keys(map_api_history);
    let idxApiName, cntApiNames = api_names.length;
    for( idxApiName = 0; idxApiName < cntApiNames; ++ idxApiName ) {
        let strApiName = api_names[idxApiName];
        let strIdFromApiName = strApiName.replace( "/", "_" );

        let api_history_arr = helper_extract_api_history_arr( fnExtractRPC, strApiName );
        let len_api_history_arr = api_history_arr.length;
        if( len_api_history_arr <= 0 )
            continue;
        let last_api_entry = api_history_arr[ len_api_history_arr - 1 ];

        let tr_id = "id_api_" + idxPage + "_" + strApiName;
        let td = null,
            tr = map_tr_apis[ idxPage ][ tr_id ];
        let bHaveRow = (tr === undefined || tr === null ) ? false : true;
        if( bHaveRow ) {
            // while( tr.children.length > 0 )
            //     tr.deleteCell(0 );
        } else {
            tr = document.createElement( "tr" );
            tr.className = " stats_table";
            //tr.problem_marker = false;
            map_tr_apis[ idxPage ][ tr_id ] = tr;
        }
        //if( last_api_entry.errors > 0 || last_api_entry.exceptions > 0 || last_api_entry.unknown > 0 )
        //	tr.problem_marker = true;
        let nCellIndex = 0;
        let strApiNameColored = strApiName.replace( "/", "<span style=\"color:#808080;\">/</span>" );
        let strApiNameSearch = "" + strApiName;
        let n = strApiNameSearch.lastIndexOf( "/" );
        if( n >= 0 ) {
            strApiNameSearch = strApiNameSearch.substr( n + 1 );
            if( strApiNameSearch.length == 0 )
                strApiNameSearch = "" + strApiName;
        }
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table";
            tr.appendChild( td );
        }
        td.innerHTML = strApiNameColored;
        //
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = last_api_entry.calls;
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = Number( last_api_entry.cps ).toFixed( g_nDecimalsToShow );
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table spark_td";
            td.innerHTML = "<span class=\"spark_adjustment\" id=\"id_api_sparkline_" + idxPage + "_" + strIdFromApiName + "_" + "cps\"></span>";
            tr.appendChild( td );
        }
        //
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = Number( last_api_entry.bytes_recv).toFixed(g_nDecimalsToShow4Bytes );
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = Number( last_api_entry.bps_recv).toFixed( g_nDecimalsToShow );
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table spark_td";
            td.innerHTML = "<span class=\"spark_adjustment\" id=\"id_api_sparkline_" + idxPage + "_" + strIdFromApiName + "_" + "bps_recv\"></span>";
            tr.appendChild( td );
        }
        //
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = last_api_entry.answers;
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = Number( last_api_entry.aps ).toFixed( g_nDecimalsToShow );
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table spark_td";
            td.innerHTML = "<span class=\"spark_adjustment\" id=\"id_api_sparkline_" + idxPage + "_" + strIdFromApiName + "_" + "aps\"></span>";
            tr.appendChild( td );
        }
        //
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = Number( last_api_entry.bytes_sent).toFixed(g_nDecimalsToShow4Bytes );
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = Number( last_api_entry.bps_sent).toFixed( g_nDecimalsToShow );
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table spark_td";
            td.innerHTML = "<span class=\"spark_adjustment\" id=\"id_api_sparkline_" + idxPage + "_" + strIdFromApiName + "_" + "bps_sent\"></span>";
            tr.appendChild( td );
        }
        //
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = last_api_entry.errors;
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = Number( last_api_entry.erps ).toFixed( g_nDecimalsToShow );
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table spark_td";
            tr.appendChild( td );
            td.innerHTML = "<span class=\"spark_adjustment\" id=\"id_api_sparkline_" + idxPage + "_" + strIdFromApiName + "_" + "erps\"></span>";
        }
        //
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = last_api_entry.exceptions;
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table right_td";
            tr.appendChild( td );
        }
        td.innerHTML = Number( last_api_entry.exps ).toFixed( g_nDecimalsToShow );
        ++ nCellIndex;
        if( bHaveRow )
            td = tr.children[ nCellIndex ];
        else {
            td = document.createElement( "td" );
            td.className += " stats_table spark_td";
            tr.appendChild( td );
            td.innerHTML = "<span class=\"spark_adjustment\" id=\"id_api_sparkline_" + idxPage + "_" + strIdFromApiName + "_" + "exps\"></span>";
        }
        //
        apis_table_tbody.appendChild( tr );

        if( last_api_entry.errors > 0 || last_api_entry.exceptions > 0 || last_api_entry.unknown > 0 )
            $( tr ).addClass( "zombie_row" );
        //
        update_api_sparkline( idxPage, api_history_arr, strApiName, "cps" );
        update_api_sparkline( idxPage, api_history_arr, strApiName, "bps_recv" );
        update_api_sparkline( idxPage, api_history_arr, strApiName, "aps" );
        update_api_sparkline( idxPage, api_history_arr, strApiName, "bps_sent" );
        update_api_sparkline( idxPage, api_history_arr, strApiName, "erps" );
        update_api_sparkline( idxPage, api_history_arr, strApiName, "exps" );
    } // for( idxApiName = 0; idxApiName < cntApiNames; ++ idxApiName )
}

function format_performance_time( d ) {
    return Number( d ).toFixed( 9 );
}

function generate_rpc_performance_panel( strCaption, joPerformanceInfo ) {
    let strContent = "";
    strContent += "<div class=\"performance_div\">";
    strContent += "<div class=\"performance_header\">" + strCaption + "</div>";
    strContent += "<table class=\"performance_table\"><tbody>";
    strContent += "<tr><td class=\"performance_header\">Min call time, seconds</td><td class=\"performance_value\">" + format_performance_time( joPerformanceInfo.callTimeMin ) + "</td></tr>";
    strContent += "<tr><td class=\"performance_header\">Max call time, seconds</td><td class=\"performance_value\">" + format_performance_time( joPerformanceInfo.callTimeMax ) + "</td></tr>";
    strContent += "<tr><td class=\"performance_header\">Average</td><td class=\"performance_value\">" + format_performance_time( joPerformanceInfo.callTimeAvg ) + "</td></tr>";
    strContent += "<tr><td class=\"performance_header\">Fastest method</td><td class=\"performance_value\">" + joPerformanceInfo.methodMin + "</td></tr>";
    strContent += "<tr><td class=\"performance_header\">Slowest method</td><td class=\"performance_value\">" + joPerformanceInfo.methodMax + "</td></tr>";
    if( "protocolMin" in joPerformanceInfo )
        strContent += "<tr><td class=\"performance_header\">Fastest protocol</td><td class=\"performance_value\">" + joPerformanceInfo.protocolMin + "</td></tr>";
    if( "protocolMax" in joPerformanceInfo )
        strContent += "<tr><td class=\"performance_header\">Slowest protocol</td><td class=\"performance_value\">" + joPerformanceInfo.protocolMax + "</td></tr>";
    strContent += "</tbody><table>";
    strContent += "</div>";
    return strContent;
}

function render_rpc_performance_data( idxPage, joStats ) {
    let strContent = "";
    let joRpcPerformance = null;
    try { joRpcPerformance = joStats.executionPerformance.RPC } catch( err ) { joRpcPerformance = null; }
    if( joRpcPerformance && joRpcPerformance.summary && joRpcPerformance.protocols ) {
        strContent += generate_rpc_performance_panel( "RPC Summary", joRpcPerformance.summary );
        let arrProtocolNames = Object.keys( joRpcPerformance.protocols );
        for( let i = 0; i < arrProtocolNames.length; ++ i ) {
            let strProtocolName = arrProtocolNames[ i ];
            let joProtocolPerformanceInfo = joRpcPerformance.protocols[ strProtocolName ];
            strContent += generate_rpc_performance_panel( strProtocolName, joProtocolPerformanceInfo );
        }
    }
    if( strContent.length == 0 )
        strContent = "<no_data_panel>No <b>RPC performance</b> data available</no_data_panel>";
    let idPage = "#idContentPage" + idxPage;
    $(idPage).html( strContent );
}

function render_unddos_summary( idxPage, joStats ) {
    let strContent = "";
    let joUnDDOS = null;
    try { joUnDDOS = joStats.unddos } catch( err ) { joUnDDOS = null; }
    let joUnDDOS_counts = null;
    try { joUnDDOS_counts = joUnDDOS.counts } catch( err ) { joUnDDOS_counts = null; }
    if( joUnDDOS_counts && typeof joUnDDOS_counts == "object" ) {
        strContent += "<div class=\"performance_div\">";
        strContent += "<div class=\"performance_header\">JSON RPC</div>";
        strContent += "<table class=\"performance_table\"><tbody>";
        strContent += "<tr><td class=\"performance_header\">Banned origin count</td><td class=\"performance_value\">" + joUnDDOS_counts.rpc_ban + "</td></tr>";
        strContent += "<tr><td class=\"performance_header\">Working origin count</td><td class=\"performance_value\">" + joUnDDOS_counts.rpc_normal + "</td></tr>";
        strContent += "</tbody><table>";
        strContent += "</div>";
        strContent += "</div>";
        //
        strContent += "<div class=\"performance_div\">";
        strContent += "<div class=\"performance_header\">WS/WSS Calls</div>";
        strContent += "<table class=\"performance_table\"><tbody>";
        strContent += "<tr><td class=\"performance_header\">Banned origin count</td><td class=\"performance_value\">" + joUnDDOS_counts.ws_ban + "</td></tr>";
        strContent += "<tr><td class=\"performance_header\">Working origin count</td><td class=\"performance_value\">" + joUnDDOS_counts.ws_normal + "</td></tr>";
        strContent += "</tbody><table>";
        strContent += "</div>";
        strContent += "</div>";
    }
    if( strContent.length == 0 )
        strContent = "<no_data_panel>No <b>UN-DDOS / Summary</b> data available</no_data_panel>";
    let idPage = "#idContentPage" + idxPage;
    $(idPage).html( strContent );
}

function update_api_sparkline( idxPage, api_history_arr, strApiName, strPropertyName ) {
    if( api_history_arr == undefined ||
        api_history_arr == null ||
        strApiName == undefined ||
        strApiName == null ||
        strApiName.length == 0 ||
        strPropertyName == undefined ||
        strPropertyName == null ||
        strPropertyName.length == 0
        )
        return;
    let strIdFromApiName = strApiName.replace( "/", "_" );
    let id_sparkline = "#id_api_sparkline_" + idxPage + "_" + strIdFromApiName + "_" + strPropertyName;
    let arr = [];
    let i, len_api_history_arr = api_history_arr.length;
    for( i = 0; i < len_api_history_arr; ++ i ) {
        let api_entry = api_history_arr[ i ];
        let z = api_entry[strPropertyName];
        if( z == undefined || z == null )
            continue;
        arr.push( z );
    }
    while( arr.length < g_nStatsDepth )
        arr.splice(0, 0, 0 ); // inset 0 at beginning
    let strPropertyNameShort = "" + strPropertyName;
    let nPos = strPropertyNameShort.indexOf( "_" );
    if( nPos > 0 )
        strPropertyNameShort = strPropertyNameShort.substr(0, nPos );
    // https://omnipotent.net/jquery.sparkline/#s-docs
    let jqSparkline = $(id_sparkline);
    let clrSpot = "black";
    let clrLine = "#404040";
    let clrFill = "#9090FFFF";
    let fn = function () {
        jqSparkline.sparkline(
            arr, {
                type: "line",
                "lineColor": clrLine,
                "fillColor": clrFill,
                "defaultPixelsPerValue": 2,
                "spotColor": "#FF0000", //clrSpot
                "minSpotColor": clrSpot,
                "maxSpotColor": clrSpot,
                "highlightSpotColor": clrSpot,
                "highlightLineColor": clrSpot,
                // "tooltipFormat": "{{y:val}}",
                // "tooltipValueLookups": { "val": { "-1": "N/A" }}
                "tooltipFormatter": function ( sp, options, fields ) {
                    return "" + Number( fields.y ).toFixed( g_nDecimalsToShow ) + " " + strPropertyNameShort;
                }
            } );
    };
    //fn();
    setTimeout( fn, 0 );
}

function create_page_content( idxPage ) {
    clear_page_content( idxPage );
    let idPage = "#idContentPage" + idxPage;
    try {
        let joStats = lastStats();
        switch ( idxPage ) {
            case 1: // System Information
                break;
            case 2: { // Raw General Statistics as JSON
                //let strContent = "<pre>" + JSON.stringify( joStats.system, null, 4 ); + "</pre>";
                let strContent = "<pre>" + JSON.stringify( joStats, null, 4 ); + "</pre>";
                $(idPage).html(strContent);
            } break;
            case 3: // RPC / Summary Performance
                return render_rpc_performance_data( idxPage, joStats );
            case 4: // RPC / All Subsystems
            case 5: // RPC / HTTP
            case 6: // RPC / HTTPS
            case 7: // RPC / WS
            case 8: // RPC / WSS
                return helper_create_rpc_page_content( idxPage );
            case 9: // Transaction State Diagram
                return render_transaction_flow( joStats.tracepoints );
            case 10: { // Performance Timeline Tracker
                // g_performanceTimeline.destroy();
                $("#idPerformanceRecordingToolbar").css( { display: "block" } );
                $("#idPerformanceTimeline").css( { display: "block" } );
            } break;
            case 11: // UN-DDOS / Summary
                return render_unddos_summary( idxPage, joStats );
            case 12: // UN-DDOS / RPC Counters
                return helper_unddos_rpc_page_content( idxPage, joStats );
            case 13: // UN-DDOS / WS/WSS Counters
                return helper_unddos_ws_calls_page_content( idxPage, joStats );
            case 14: // Mining stats
                return helper_mining_page_content( idxPage, joStats );
            default:
            break;
        }
    } catch ( err ) {
        //strContent = "<pre>" + err + "</pre>";
        //$(idPage).html( strContent );
    }
    // return "";
}

function show_page( idxPage, isShow ) { // does not hide other pages
    let idPage = "#idContentPage" + idxPage;
    $(idPage).css( "display", ( isShow == true ) ? "block" : "none" );
}

function hide_and_clear_all_pages( nExceptPage ) {
    let idxPage;
    for( idxPage = 1; idxPage <= g_cntPages; ++ idxPage ) {
        if( idxPage === nExceptPage )
            continue;
        clear_page_content( idxPage );
        show_page( idxPage, false );
    }
}

async function do_expose_data() {
    hide_and_clear_all_pages();
    let nViewMode = parseInt($( "#idViewSelect" ).val() );
    if( nViewMode == null || nViewMode == undefined || nViewMode <= 0 || nViewMode > g_cntPages )
        nViewMode = 1;
    create_page_content( nViewMode );
    show_page( nViewMode, true );
}

async function do_refresh_data() {
    g_connection.call( {
        "jsonrpc": "2.0",
        "method": "eth_blockNumber",
        "params": []
    }, function ( joAnswer ) {
        const nLatestBlockNumber = parseInt( joAnswer.result );
        //console.log( "Latest block number is " + nLatestBlockNumber);
        $( "#idLatestBlockNumber" ).html( "<b>" + nLatestBlockNumber + "</b>" );
    } );
    g_connection.call( {
        "jsonrpc": "2.0",
        "method": "skale_stats",
        "params": null
    }, async function ( joAnswer ) {
        await pushStats( joAnswer.result );
        try {
            populate_cpu_load_stats( joAnswer.result.system.cpu_load );
            populate_mem_usage_stats( joAnswer.result.system.mem_usage );
        } catch( err ) {
        }
    } );
}

function fn_periodic_refresher() {
    let nUpdateIntervalMS = parseInt(store.get( "update_interval" ) );
    if( nUpdateIntervalMS > 0 )
        setTimeout( function () {
            try {
                do_refresh_data();
                fn_periodic_refresher();
            } catch( err ) {
                console.warn( "Data refresh error, you may need to re-connect, error is:", err );
            }
        }, nUpdateIntervalMS );
}

let g_arr_server_cpu_load_stats_history = [];

function populate_cpu_load_stats( cpu_load ) {
    try {
        if( cpu_load !== undefined )
            g_arr_server_cpu_load_stats_history.push( cpu_load );
        while( g_arr_server_cpu_load_stats_history.length > g_nStatsDepth )
            g_arr_server_cpu_load_stats_history.splice(0, 1 );
        let i, cnt = g_arr_server_cpu_load_stats_history.length;
        let arr = [];
        for( i = 0; i < cnt; ++ i ) {
            let z = g_arr_server_cpu_load_stats_history[ i ] * 100.0;
            if( z == null )
                continue; // ???
            arr.push( z );
        }
        while( arr.length < g_nStatsDepth )
            arr.splice(0, 0, 0 ); // inset 0 at beginning
        // https://omnipotent.net/jquery.sparkline/#s-docs
        let jqSparkline = $( "#cpu_load" );
        let clrSpot = "black";
        let clrLine = "#404040";
        let clrFill = "#9090FFFF";
        let fn = function () {
            jqSparkline.sparkline(
                arr, {
                    type: "line",
                    "lineColor": clrLine,
                    "fillColor": clrFill,
                    "defaultPixelsPerValue": 2,
                    "spotColor": "#FF0000", //clrSpot
                    "minSpotColor": clrSpot,
                    "maxSpotColor": clrSpot,
                    "highlightSpotColor": clrSpot,
                    "highlightLineColor": clrSpot,
                    "tooltipFormatter": function ( sp, options, fields ) {
                        return "" + Number(fields.y).toFixed( g_nDecimalsToShow ) + "%";
                    },
                    "width": "60em",
                    "height": "10em",
                    "normalRangeMin": 0,
                    "normalRangeMax": 100
                } );
        };
        //fn();
        setTimeout( fn, 0 );
    } catch ( err ) {
        console.log( err );
    }
}

let g_arr_server_mem_usage_stats_history = [];

function populate_mem_usage_stats( mem_usage ) {
    try {
        if( mem_usage !== undefined )
            g_arr_server_mem_usage_stats_history.push(mem_usage );
        while( g_arr_server_mem_usage_stats_history.length > g_nStatsDepth )
            g_arr_server_mem_usage_stats_history.splice(0, 1 );
        let i, cnt = g_arr_server_mem_usage_stats_history.length;
        let arr = [];
        for( i = 0; i < cnt; ++ i ) {
            let z = g_arr_server_mem_usage_stats_history[ i ] * 100.0;
            if( z == null )
                continue; // ???
            arr.push( z );
        }
        while( arr.length < g_nStatsDepth )
            arr.splice(0, 0, 0 ); // inset 0 at beginning
        // https://omnipotent.net/jquery.sparkline/#s-docs
        let jqSparkline = $( "#mem_usage" );
        let clrSpot = "black";
        let clrLine = "#404040";
        let clrFill = "#9090FFFF";
        let fn = function () {
            jqSparkline.sparkline(
                arr, {
                    type: "line",
                    "lineColor": clrLine,
                    "fillColor": clrFill,
                    "defaultPixelsPerValue": 2,
                    "spotColor": "#FF0000", //clrSpot
                    "minSpotColor": clrSpot,
                    "maxSpotColor": clrSpot,
                    "highlightSpotColor": clrSpot,
                    "highlightLineColor": clrSpot,
                    "tooltipFormatter": function ( sp, options, fields ) {
                        return "" + Number(fields.y).toFixed( g_nDecimalsToShow ) + "%";
                    },
                    "width": "60em",
                    "height": "10em",
                    "normalRangeMin": 0,
                    "normalRangeMax": 100
                } );
        };
        //fn();
        setTimeout( fn, 0 );
    } catch ( err ) {
        console.log( err );
    }
}

function create_transaction_flow_page() {

    $( "#href_queue" ).click( function () {
        g_connection.call( {
            "jsonrpc": "2.0",
            "method": "eth_pendingTransactions",
            "params": []
        }, function ( joAnswer ) {
            let txns = joAnswer.result;

            $( "#idTransactionsGrid" ).html( "" );
            let arrData = [];
            for( let i = 0; i < txns.length; ++ i ) {
                let t = txns[ i ];
                arrData.push( {
                    "number": i + 1,
                    "sha3": "<a href=\"javascript: do_show_transaction('"+t.hash+"');\">" + t.hash + "</a>",
                    "from": t.from,
                    "nonce": t.nonce
                } );
            }
            $( "#idTransactionsGrid" ).jsGrid( {
                "width": "95%", "height": "60%"
                , "inserting": false, "editing": false, "sorting": true
                ,"data": arrData
                ,"fields": [
                    { "name": "number", "type": "number", "width": "3%", "title": "#" },
                    { "name": "sha3", "type": "text", "width": "55%", "title": "SHA3" },
                    { "name": "from", "type": "text", "width": "35%", "title": "From" },
                    { "name": "nonce", "type": "number", "width": "7%", "title": "nonce" },
                ]
            } );
        } );
        $( "#idDialogTransactions" ).dialog( "open" );
    } );

    $( "#idDialogTransactions" ).dialog( {
        width: "90em",
        autoOpen: false
    } );

    g_transaction_diagram = new dhx.Diagram( "idTxDiagram" );

    let data = [
        { id: "recv_rpc", x: 0,       y: 0, text: "Received\nJSON-RPC", type: "circle" },
        { id: "rejected_rpc", x: 150, y: 55, text: "Rejected", type: "circle" },
        {from: "recv_rpc", to: "rejected_rpc", forwardArrow: true, fromSide: "bottom", toSide: "left" },

        { id: "recv_zmq",     x: 300,       y: 0, text: "Received\nZMQ", type: "circle" },
        { id: "rejected_zmq", x: 450,       y: 55, text: "Rejected", type: "circle" },
        {from: "recv_zmq", to: "rejected_zmq", forwardArrow: true, fromSide: "bottom", toSide: "left" },

        {from: "recv_rpc", to: "queued", forwardArrow: true},
        { id: "queued",         x: 0,   y: 150, text: "Queued", type: "circle" },

        { id: "queued_zmq",         x: 300,   y: 150, text: "Queued", type: "circle" },

        {from: "queued", to: "bcasted", forwardArrow: true},
        { id: "bcasted",      x: 0,   y: 300, text: "Broadcasted", type: "circle" },
        { id: "queued_to_bcasted",      x: 40,   y: 270, text: "", type: "circle", width: 10, height:10 },
        { id: "now_invalid",  x: 150, y: 355, text: "Dropped\nnow invalid", type: "circle" },
        {from: "bcasted", to: "now_invalid", forwardArrow: true, fromSide: "bottom", toSide: "left" },

        {from: "bcasted", to: "cache", forwardArrow: true},
        { id: "cache",        x: 0,   y: 450, text: "Cache\n(sent to cons )", type: "circle" },
        { id: "cached_again",  x: -100,   y: 550, text: "Cached\nAgain", type: "circle" },
        {from: "cache", to: "cached_again", forwardArrow: true, fromSide: "left" },
        {from: "cached_again", to: "cache", forwardArrow: true, fromSide: "right", type: "dash" },

        {from: "recv_zmq", to: "queued_zmq", forwardArrow: true},
        {from: "queued_zmq", to: "queued_to_bcasted", forwardArrow: true, fromSide:"bottom", toSide: "right" },

        { id: "block", x: 250,   y: 450, text: "In Block", type: "circle" },
        { id: "recv_cons",  x: 100,   y: 550, text: "Received\nConsensus", type: "circle" },

        {from: "cache", to: "block", forwardArrow: true},
        {from: "recv_cons", to: "block", forwardArrow: true, fromSide: "right" },
        {from: "bcasted", to: "block", forwardArrow: true, fromSide: "right", toSide: "top" },

        {id: "cnt_receive_transaction_success", x: 365, y: 130, type: "text", text: "n/a" },
        {id: "cnt_broadcast", x: 60, y: 260, type: "text", text: "n/a" },
        {id: "cnt_drop_real_bad",  x: 120, y: 395, type: "text", text: "n/a" },
        {id: "cnt_sent_txn_new",  x: 70, y: 420, type: "text", text: "n/a" },
        {id: "cnt_sent_txn_again",  x: -40, y: 490, type: "text", text: "n/a" },
        {id: "cnt_broadcast_already_have",  x: 200, y: 270, type: "text", text: "n/a" },

        {id: "cnt_import_future",  x: 310, y: 400, type: "text", text: "n/a" },
        {id: "cnt_drop_good",  x: 220, y: 490, type: "text", text: "n/a" },
        {id: "cnt_really_consensus_born",  x: 310, y: 570, type: "text", text: "n/a" },

        {id: "cnt_bcasted",      x: -40,   y: 350, type: "text", text: "n/a" },
        {id: "cnt_cache",  x: -10, y: 470, type: "text", text: "n/a" },
    ];

    g_transaction_diagram.data.parse( data );
}

function render_transaction_flow( tracepoints ) {
    let text_items = g_transaction_diagram.data.findAll( function ( arg ) {
        return arg.id.search( "cnt_" ) == 0;
    } );
    // set virtual zeros
    if( ! ( "import_consensus_born" in tracepoints ) )
        tracepoints.import_consensus_born = 0;
    if( ! ( "import_future" in tracepoints ) )
        tracepoints.import_future = 0;
    if( ! ( "drop_bad" in tracepoints ) )
        tracepoints.drop_bad = 0;
    if( ! ( "broadcast_already_have" in tracepoints ) )
        tracepoints.broadcast_already_have = 0;
    for( i in text_items ) {
        let item = text_items[ i ];
        key = item.id.substr(4 );
        if( key in tracepoints )
            g_transaction_diagram.data.update( item.id, { "text": tracepoints[key].toString() } );
        else
            g_transaction_diagram.data.update( item.id, { "text": "0" } );

        if( key == "really_consensus_born" ) {
            let val = +tracepoints.import_consensus_born - tracepoints.import_future;
            g_transaction_diagram.data.update( item.id, { "text": val.toString() } );
        } // really_consensus_born
        else if( key == "drop_real_bad" ) {
            let val = +tracepoints.drop_bad - tracepoints.import_future;
            g_transaction_diagram.data.update( item.id, { "text": val.toString() } );
        } // drop_really_bad
        else if( key == "bcasted" ) {
            let val = +tracepoints.broadcast + tracepoints.broadcast_already_have - tracepoints.sent_txn_new - tracepoints.drop_bad;
            g_transaction_diagram.data.update( item.id, { "text": val.toString() } );
        } // bcasted
        else if( key == "cache" ) {
            let val = +tracepoints.sent_txn_new - tracepoints.drop_good;
            g_transaction_diagram.data.update( item.id, { "text": val.toString() } );
        } // bcasted
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//
// see: https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
//
function hue2rgb( p, q, t ){
    if( t < 0 ) t += 1;
    if( t > 1 ) t -= 1;
    if( t < 1/6 ) return p + ( q - p ) * 6 * t;
    if( t < 1/2 ) return q;
    if( t < 2/3 ) return p + ( q - p ) * (2/3 - t) * 6;
    return p;
}
// converts an HSL color value to RGB. Conversion formula
// adapted from http://en.wikipedia.org/wiki/HSL_color_space
// assumes h, s, and l are in range [0...1]
// returns array containing r, g, and b in range [0...255]
function hslToRgb( h, s, l ) {
    let r, g, b;
    if( s == 0 )
        r = g = b = l; // achromatic
    else {
        let q = l < 0.5 ? l * ( 1 + s ) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb( p, q, h + 1 / 3 );
        g = hue2rgb( p, q, h);
        b = hue2rgb( p, q, h - 1 / 3 );
    }
    return [ Math.round( r * 255 ), Math.round( g * 255 ), Math.round( b * 255 ) ];
}
// converts an RGB color value to HSL. Conversion formula
// adapted from http://en.wikipedia.org/wiki/HSL_color_space
// assumes r, g, and b are in range [0....255] and
// returns array containing h, s, and l in range [0...1]
function rgbToHsl( r, g, b ) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max( r, g, b ), min = Math.min( r, g, b );
    let h, s, l = ( max + min ) / 2;
    if( max == min )
        h = s = 0; // achromatic
    else {
        let d = max - min;
        s = ( l > 0.5 ) ? d / ( 2 - max - min ) : d / ( max + min );
        switch( max ) {
        case r: h = ( g - b ) / d + ( g < b ? 6 : 0 ); break;
        case g: h = ( b - r ) / d + 2; break;
        case b: h = ( r - g ) / d + 4; break;
        }
        h /= 6;
    }
    return [ h, s, l ];
}

function componentToHex( c ) {
    let hex = c.toString( 16 );
    return ( hex.length == 1 ) ? "0" + hex : hex;
}
function rgbToHex( r, g, b ) {
    return "#" + componentToHex( r ) + componentToHex( g ) + componentToHex( b );
}
function rgbArrayToHex( arr ) {
    return rgbToHex( arr[0], arr[1], arr[2] );
}
function hexToRgb( hex ) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt( result[ 1 ], 16 ),
        g: parseInt( result[ 2 ], 16 ),
        b: parseInt( result[ 3 ], 16 )
        } : null;
}
function hexToRgbArray( hex ) {
    let joRGB = hexToRgb( hex );
    return ( joRGB != null ) ? [ joRGB.r, joRGB.g, joRGB.b ] : null;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function replaceAll( str, find, replace ) {
	return str.replace( new RegExp( find, "g" ), replace );
}

function join_with_prefix_and_suffix( arr, sep, prefix, suffix ) {
    sep = sep ? ( "" + sep ) : "";
    prefix = prefix ? ( "" + prefix ) : "";
    suffix = suffix ? ( "" + suffix ) : "";
    let s = "";
    for( let i = 0; i < arr.length; ++ i ) {
        if( i > 0 )
            s += sep;
        s += prefix + arr[ i ] + suffix;
    }
    return s;
}

function format_group_name( strCompactSpec, strColorizedClassName ) {
    let strColorizedClassSpec = ( strColorizedClassName && typeof strColorizedClassName == "string" && strColorizedClassName.length >= 2 ) ? ( " " + strColorizedClassName + " " ) : "";
    let arr = strCompactSpec.split( "/" );
    if( arr.length < 2 )
        return "" + strCompactSpec;
    let s = "", first = "" + arr[ 0 ];
    arr.splice( 0, 1 );
    switch( first ) {
    case "bc":
        s += "<span class=\"groupName0" + strColorizedClassSpec + "\">BLOCKCHAIN</span>";
        if( arr.length == 1 ) {
            s += "<br>";
            s += replaceAll( arr[ 0 ], "_", " " );
            arr.splice( 0, 1 );
        }
    break;
    case "rpc":
        if( arr.length >= 1 ) {
            s += "<span class=\"groupName0" + strColorizedClassSpec + "\">RPC</span> <span class=\"groupName1" + strColorizedClassSpec + "\">" + arr[ 0 ] + "</span>";
            if( arr.length >= 2 )
                s += "<br>";
            arr.splice( 0, 1 );
        } else {
            s += "<span class=\"groupName0" + strColorizedClassSpec + "\">RPC</span>/"
        }
    break;
    case "dispatch":
        if( arr.length >= 2 ) {
            let second = arr[ 0 ];
            switch( second ) {
            case "thread":
                arr.splice( 0, 1 );
                s += "<span class=\"groupName0" + strColorizedClassSpec + "\">THREAD</span> " + join_with_prefix_and_suffix( arr, "/", "<span class=\"groupName1\">", "</span>" );
                arr.splice( 0, 1 );
            break;
            case "queue":
                arr.splice( 0, 1 );
                s += "<span class=\"groupName0" + strColorizedClassSpec + "\">QUEUE</span> <span class=\"groupName1" + strColorizedClassSpec + "\">" + arr[ 0 ] + "</span>";
                arr.splice( 0, 1 );
                if( arr.length > 0 )
                    s += "<br>";
            break;
            default:
                s += "<span class=\"groupName0" + strColorizedClassSpec + "\">DISPATCH</span><br><span class=\"groupName1\">" + arr[0] + "</span> <span class=\"groupName2\">" + arr[1] + "</span>";
                if( arr.length > 2 )
                    s += "<br>";
                arr.splice( 0, 2 );
                break;
            }
        } else {
            s += "<b>DISPATCH</b>/"
        }
    break;
    default:
        s += "<span class=\"groupName0" + strColorizedClassSpec + "\">" + first + "</span>";
        if( arr.length > 0 )
            s += "<br>";
    break;
    }
    s += join_with_prefix_and_suffix( arr, "/", "<span class=\"groupName2\">", "</span>" );;
    return s;
}

function format_task_tooltip( strQueueName, joEvent ) {
     // "" + strQueueName + " " + idTask + "<br>" + JSON.stringify( joEvent.jsn )
    let s = "";
    //s += "";
    s += "<table>";
    s += "<tr><td><b>Name:</b></td><td>" + joEvent.name + "</td></tr>";
    s += "<tr><td><b>Subsystem:</b></td><td>" + strQueueName + "</td></tr>";
    //s += "<tr><td><b># in tracker:</b></td><td>" + joEvent.it + "</td></tr>";
    //s += "<tr><td><b># in subsystem:</b></td><td>" + joEvent.it + "</td></tr>";
    s += "<tr><td><b>Start:</b></td><td>" + joEvent.tsStart + "</td></tr>";
    s += "<tr><td><b>End:</b></td><td>" + joEvent.tsEnd + "</td></tr>";
    s += "<tr><td><b>Duration:</b></td><td>" + joEvent.duration + "</td></tr>";

    // if( "jsnIn" in joEvent && Object.keys( joEvent.jsnIn ).length > 0 )
    //     s += "<tr><td colspan=\"2\"><b>Input:</b> <pre>" + JSON.stringify( joEvent.jsnIn, null, 4 ) + "</pre></td></tr>";
    // if( "jsnOut" in joEvent && Object.keys( joEvent.jsnOut ).length > 0 )
    //     s += "<tr><td colspan=\"2\"><b>Output:</b> <pre>" + JSON.stringify( joEvent.jsnOut, null, 4 ) + "</pre></td></tr>";
    // if( "jsnErr" in joEvent && Object.keys( joEvent.jsnErr ).length > 0 )
    //     s += "<tr><td colspan=\"2\"><b>Error:</b> <pre>" + JSON.stringify( joEvent.jsnErr, null, 4 ) + "</pre></td></tr>";

    if( "jsnIn" in joEvent && Object.keys( joEvent.jsnIn ).length > 0 )
        s += "<tr><td ><b>Input:</b></td><td class=\"jtd\">" + JSON.stringify( joEvent.jsnIn, null, 4 ) + "</td></tr>";
    if( "jsnOut" in joEvent && Object.keys( joEvent.jsnOut ).length > 0 )
        s += "<tr><td ><b>Input:</b></td><td class=\"jtd\">" + JSON.stringify( joEvent.jsnOut, null, 4 ) + "</td></tr>";
    if( "jsnErr" in joEvent && Object.keys( joEvent.jsnErr ).length > 0 )
        s += "<tr><td ><b>Input:</b></td><td class=\"jtd\">" + JSON.stringify( joEvent.jsnErr, null, 4 ) + "</td></tr>";

    s += "</table>";
    return s;
}

function ts2date( ts ) {
    // ts example:
    //  0----|----1----|----2----|----
    //  012345678901234567890123456789
    // "2020-03-19 19:42:55.663196"
    let year = parseInt( ts.substring( 0, 4 ) );
    let month = parseInt( ts.substring( 5, 7 ) ) + 1;
    let day = parseInt( ts.substring( 8, 10 ) );
    let hour = parseInt( ts.substring( 11, 13 ) );
    let minute = parseInt( ts.substring( 14, 16 ) );
    let second = parseInt( ts.substring( 17, 19 ) );
    let millisecond = ts.substring( 20 );
    if( millisecond.length > 3 )
        millisecond = millisecond.substring( 0, 3 );
    else while( millisecond.length < 3 )
        millisecond = "0" + millisecond;
    millisecond = parseInt( millisecond );
    let u = Date.UTC( year, month, day, hour, minute, second, millisecond );
    let d = new Date( u );
    d.setMilliseconds( millisecond );
    return d;
}

let g_performanceTimeline = { // Performance Timeline Tracker
    control: null
    , data: null
    , groups: null
    , items: null
    , summaryItemsCount: 0
    , groupStatsByName: { }
    , groupStatsByID: { }
    , itemStatsByID: { }
    , isDownloadInProgress: false
    , timelineControlOptions: { // configuration for the Timeline
        showCurrentTime: false
        , groupOrder: "rawGroupNameForOrdering" // "content"
        , minHeight: "10em"
        , stack: true
        , start: null
        , end: null
        , min: null
        , max: null
        , orientation: {
            axis: "top"
            , item: "top"
        }
        , showTooltips: false // true
        , tooltip: {
            followMouse: false,
            overflowMethod: "flip"                      
        }, margin: {
            axis: 0
            , item: {
                horizontal: 2
                , vertical: 1
            }
        }
    }, create: function () {
        try {
            let self = this;
            if( self.control )
                g_performanceTimeline.destroy();
            if( ! self.data.success )
                throw "no data";
            if( ! self.data.success ) {
                let strError = "failed to fetch performance tracker data";
                if( "sessionStopReason" in self.data
                    && typeof self.data.sessionStopReason == "string"
                    && self.data.sessionStopReason.length > 0
                    )
                    strError += ", " + self.data.sessionStopReason;
                throw strError;                    
            }
            let joPerformance = self.data.performance;
            let joMapQueues = joPerformance.queues;
            // let nextTimeFetchIndex = 0 + parseInt( joPerformance.nextTimeFetchIndex );
            // self.data.maxItemCount
            // self.data.sessionMaxItemCount
            // self.data.sessionStopReason
            self.timelineControlOptions.min = self.timelineControlOptions.start = ts2date( joPerformance.tsStart );
            self.timelineControlOptions.max = self.timelineControlOptions.end = ts2date( joPerformance.tsEnd );
            $("#idPerformanceRecordingToolbar").css( { display: "block" } );
            $("#idPerformanceTimeline").css( { display: "block" } );
            self.groups = new vis.DataSet();
            self.items = new vis.DataSet();
            let elPerformanceTimeline = document.getElementById( "idPerformanceTimeline" );
            let idxEnumeratorGroup = 1;
            let idxEnumeratorTask = 1;
            self.summaryItemsCount = 0;
            self.groupStatsByName = { };
            self.groupStatsByID = { };
            for( let [ strQueueName, jarrQueueEvents ] of Object.entries( joMapQueues ) ) {
                let idGroup = idxEnumeratorGroup ++;
                let strGroupClassName = "rainbow" + ( idGroup % 8 );
                let strGroupCaptionClassName = ""; // "text-rainbow" + ( idGroup % 8 );
                let controlGroup = {
                    id: 0 + idGroup
                    , content: "" + format_group_name( strQueueName, strGroupCaptionClassName ) // "" + strQueueName
                    , rawGroupNameForOrdering: "" + strQueueName
                };
                self.groups.add( controlGroup );
                let statsGroup = {
                    controlGroup: controlGroup
                    , itemStatsByID: { }
                };
                self.groupStatsByName[ "" + strQueueName ] = statsGroup;
                self.groupStatsByID[ 0 + idGroup ] = statsGroup;
                for( let idxEvent = 0; idxEvent < jarrQueueEvents.length; ++ idxEvent ) {
                    let joEvent = jarrQueueEvents[ idxEvent ];
                    let idTask = idxEnumeratorTask ++;
                    let dtEventStart = ts2date( joEvent.tsStart );
                    let dtEventEnd = ts2date( joEvent.tsEnd );
                    if( dtEventStart == dtEventEnd )
                        dtEventEnd += 1;
                    let strType = "range";
                    // let tds = dtEventEnd - dtEventStart;
                    // if( tds <= 1 )
                    //     strType = "box";
                    let controlItem = {
                        id: 0 + idTask
                        , group: 0 + idGroup
                        , type: strType // "range", "point", "range", "background"
                        , content: "" + joEvent.name
                        , title: "" + format_task_tooltip( strQueueName, joEvent ) // "" + strQueueName + " " + idTask + "<br>" + JSON.stringify( joEvent.jsn )
                        , start: dtEventStart
                        , end: dtEventEnd
                        , className: strGroupClassName
                    };
                    let statsItem = {
                        controlItem: controlItem
                        , taskItem: joEvent
                    };
                    statsGroup.itemStatsByID[ 0 + idTask ] = statsItem;
                    self.itemStatsByID[ 0 + idTask ] = statsItem;
                    self.items.add( controlItem );
                    ++ self.summaryItemsCount;
                }
            }
            self.control = new vis.Timeline( elPerformanceTimeline );
            self.control.setOptions( self.timelineControlOptions );
            self.control.setGroups( self.groups );
            self.control.setItems( self.items );
            setTimeout( function() {
                if( ! self.control )
                    return;
                self.control.redraw();
                self.update_ui();
            }, 100 );
            self.update_ui();
            self.control.on( "mouseOver", function( event ) {
                if( event.what != "item" )
                    return;
                // console.log( "mouseOver --->", event );
                let statsItem = self.itemStatsByID[ event.item ];
                if( ! statsItem )
                    return;
                if( ! statsItem.controlItem )
                    return;
                if( ! statsItem.controlItem.title )
                    return;
                // console.log( "mouseOver --->", statsItem );
                if( ! event.event )
                    return;
                let el = event.event.toElement; // event.event.relatedTarget
                if( ! el )
                    return;
                $( el ).webuiPopover( {
                    //, trigger: "hover"
                    content: "" + statsItem.controlItem.title
                } ).show();
            

            } );
            return;
        } catch( err ) {
            g_performanceTimeline.destroy();
            console.warn( "Failed to initialize performance tracker timeline:", err );
            $("#idPerformanceTimeline").html( "<b>Failed to initialize performance tracker timeline:</b><br>" + err.toString() );
            g_performanceTimeline.update_ui();
        }
    }, destroy: function () {
        let self = this;
        $("#idPerformanceTimeline").css( { display: "hidden" } );
        if( self.items ) {
            self.items.clear();
            self.items = null;
        }
        if( self.groups ) {
            self.groups.clear();
            self.groups = null;
        }
        if( self.control ) {
            self.control.destroy();
            self.control = null;
        }
        self.data = null;
        self.summaryItemsCount = 0;
        self.groupStatsByName = { };
        self.groupStatsByID = { };
        self.itemStatsByID = { };
        $("#idPerformanceTimeline").html( "" );
        self.update_ui();
    }, zoom_all: function() {
        let self = this;
        if( ! ( self.control && self.data ) )
            return;
        let joPerformance = self.data.performance;
        self.control.setWindow( { start: ts2date( joPerformance.tsStart ), end: ts2date( joPerformance.tsEnd ) } );
    }, zoom_plus: function( zv ) {
        let self = this;
        if( ! ( self.control && self.data ) )
            return;
        if( typeof zv == undefined || (!zv) )
            zv = 0.5;
            self.control.zoomIn( zv );
    }, zoom_minus: function( zv ) {
        let self = this;
        if( ! ( self.control && self.data ) )
            return;
        if( typeof zv == undefined || (!zv) )
            zv = 0.5;
            self.control.zoomOut( zv );
    }, move_timeline_control: function( percentage ) {
        let self = this;
        if( ! ( self.control && self.data ) )
            return;
        var range = self.control.getWindow();
        var interval = range.end - range.start;
        self.control.setWindow( {
            start: range.start.valueOf() - interval * percentage,
            end:   range.end.valueOf()   - interval * percentage
        } );
    }, move_left: function() {
        let self = this;
        if( ! ( self.control && self.data ) )
            return;
        self.move_timeline_control( 0.5 );
    }, move_right: function() {
        let self = this;
        if( ! ( self.control && self.data ) )
            return;
        self.move_timeline_control( -0.5 );
    }, update_ui: function( isForceShow, isForceHide ) {
        let self = this;
        isForceShow = ( isForceShow == undefined ) ? false : ( isForceShow ? true : false );
        isForceHide = ( isForceHide == undefined ) ? false : ( isForceHide ? true : false );
        let sel = "#idPerformanceZoomControls, #idPerformanceMoveControls, #idPerformanceViewOptionsControls";
        if( ( self.control && self.data && (!isForceHide) ) || isForceShow ) {
            // self.start_stop_recording_animation( false );
            $(sel).css( { display: "inline-block", visibility: "visible" } );
        } else {
            // self.start_stop_recording_animation( true );
            $(sel).css( { display: "hidden", visibility: "hidden" } );
        }
        $("#idPerformanceItemStacking").prop( "checked", self.timelineControlOptions.stack ? 1 : 0 );
    }, handleStackingClicked: function() {
        let self = this;
        self.timelineControlOptions.stack = $("#idPerformanceItemStacking").prop( "checked" ) ? true : false;
        self.control.setOptions( { stack: self.timelineControlOptions.stack ? true : false } );
    }, start_stop_recording_animation: function ( isStart ) {
        let self = this;
        let fnIn = null, fnOut = null;
        fnIn = function() {
            if( self.isDownloadInProgress )
                $("#idPerformanceRecordingProgressLabel").fadeIn( 700, fnOut );
        };
        fnOut = function() {
            if( self.isDownloadInProgress )
                $("#idPerformanceRecordingProgressLabel").fadeOut( 700, fnIn );
        };
        if( isStart )
            fnIn();
        else
            $("#idPerformanceRecordingProgressLabel").fadeOut( 100 );
    }, start_stop_recording: function () {
        let self = this;
        self.update_ui();
        let jqRecordStartStop = $("#idPerformanceRecordingStartStop");
        if( jqRecordStartStop.hasClass("green") ) {
            self.destroy();
            self.isDownloadInProgress = true;
            self.start_stop_recording_animation( true );
            g_connection.call( {
                "jsonrpc": "2.0",
                "method": "skale_performanceTrackingStart",
                "params": {
                    isRestart: true
                }
            }, function ( joAnswer ) {
                let isRunning = false;
                try {
                    if( joAnswer.result.success === true && joAnswer.result.trackerIsRunning == true )
                        isRunning = true;
                } catch( err ) {
                }
                if( isRunning ) {
                    jqRecordStartStop.addClass("red").removeClass("green").html("&nbsp;&nbsp;Stop Recording&nbsp;&nbsp;");
                } else {
                    alert( "Failed to start performance tracker" );
                }
            } );
            self.update_ui( false, true  );
        } else {
            g_connection.call( {
                "jsonrpc": "2.0",
                "method": "skale_performanceTrackingStop",
                "params": {
                    isRestart: true
                }
            }, function ( joAnswer ) {
                self.isDownloadInProgress = false;
                self.start_stop_recording_animation( false );
                jqRecordStartStop.addClass("green").removeClass("red").html("&nbsp;&nbsp;Start Recording&nbsp;&nbsp;");
                self.destroy();
                self.data = joAnswer.result;
                self.create();
            } );
        }
    }    
};

//setWindow
