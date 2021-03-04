let g_nStatsDepth = 32;

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

function onChangeUpdateInterval() {
    let nUpdateIntervalMS = parseInt($( "#idUpdateInterval" ).val() );
    if( nUpdateIntervalMS == null || nUpdateIntervalMS == undefined || nUpdateIntervalMS < 500 )
        nUpdateIntervalMS = 500;
    store.set( "update_interval", nUpdateIntervalMS );
    fn_periodic_refresher();
}

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

    joHistoryURLs.load( "history_urls" );
    joHistoryURLs.setModified( false );
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

async function do_refresh_data() {
    g_connection.call( {
        "jsonrpc": "2.0",
        "method": "consensus_getTPSAverage",
        "params": []
    }, function ( joAnswer ) {
        const nTPS = parseInt( joAnswer.result );
        // console.log( "TPS is ", nTPS );
        append_to_mining_history_array( g_arrTPS, nTPS );
        update_mining_ui_part( "MiningTransactionsPerSecond", g_arrTPS, 0 );
    } );
    g_connection.call( {
        "jsonrpc": "2.0",
        "method": "consensus_getBlockSizeAverage",
        "params": []
    }, function ( joAnswer ) {
        const nBlockSize = parseInt( joAnswer.result );
        // console.log( "Block size is ", nBlockSize );
        append_to_mining_history_array( g_arrBS, nBlockSize );
        update_mining_ui_part( "MiningBlockSize", g_arrBS, 0 );
    } );
    g_connection.call( {
        "jsonrpc": "2.0",
        "method": "consensus_getBlockTimeAverageMs",
        "params": []
    }, function ( joAnswer ) {
        const lfBlockTime = parseInt( joAnswer.result ) / 1000.0;
        // console.log( "Block time is ", lfBlockTime.toFixed( 2 ) );
        append_to_mining_history_array( g_arrBT, lfBlockTime );
        update_mining_ui_part( "MiningBlockTime", g_arrBT, 2 );
    } );
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

function append_to_mining_history_array( arr, val ) {
    arr.push( val );
    while( arr.length > g_nStatsDepth )
        arr.shift();
    while( arr.length < g_nStatsDepth )
    arr.splice(0, 0, 0 ); // inset 0 at beginning
    return arr;
}

function new_mining_chart( element_id, strLabel, suggestedMax ) {
    const ctx = document.getElementById( element_id ).getContext( "2d" );
    const chart = new Chart( ctx, {
        type: "line",
        data: {
            labels: create_mining_chart_labels_array(), // ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: strLabel,
                backgroundColor: "#F0F5FFA0",
                borderColor: "#2080FF",
                borderWidth: 2,
                fill: true,
                // steppedLine: "middle",
                cubicInterpolationMode: "monotone",
                pointBackgroundColor: "#2080FF",
                pointBorderColor: "#2080FF",
                pointBorderWidth: 0,
                data: [] // [0, 10, 5, 2, 20, 30, 45]
            }]
        },
        options: {
            responsive: false,
            // beginAtZero: true
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 0 + suggestedMax
                    }
                }]
            }
        }
    });
    return chart;
}

function create_mining_chart_labels_array() {
    const arr = [];
    for( let i = 0; i < g_nStatsDepth; ++ i )
        arr.push( " " );
    return arr;
}

const g_arrTPS = [];
const g_arrBS = [];
const g_arrBT = [];
const g_charts = {};

// function helper_mining_page_content( idxPage, joStats ) {

function update_mining_ui_part( suffix, arrGathered, nFixed ) {
    nFixed = nFixed || 0;
    const valCurrent = ( arrGathered.length > 0 ) ? arrGathered[ arrGathered.length - 1 ] : 0;
    $( "div#id" + suffix ).html( valCurrent.toFixed( nFixed ) );
    //
    let gauge = find_gauge_by_element_id( "idGauge" + suffix );
    gauge.value = valCurrent;
    //
    let chart = null;
    if( suffix in g_charts )
        chart = g_charts[ suffix ];
    else {
        chart = new_mining_chart( "idChart" + suffix, "Chart - " + suffix, 1 );
        g_charts[ suffix ] = chart;
    }
    chart.data.datasets[0].data = arrGathered;
    chart.update( 0 );
}