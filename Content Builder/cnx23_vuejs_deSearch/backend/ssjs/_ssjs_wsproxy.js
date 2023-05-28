<script runat="server">
Platform.Load("core", "1.1.1");

/******
    ws.retrieve
    var config = {
        soapObjName: "", //required
        cols: [], //required
        mid: "", //optional
        filter: {}, //optional
        opts: {}, //optional
        props: {} //optional
    }

    ws.create
    var config = {
        soapObjName: "", //required
        payload: {}, //required
        mid: "" //optional
    }

    ws.update
    var config = {
        soapObjName: "", //required
        payload: {}, //required
        options: {} //required
    }

    ws.perform
    var config = {
        soapObjName: "", //required
        payload: {}, //required
        options: {} //required
    }
 ******/
function wsproxy() {
    var prox = new Script.Util.WSProxy();
    var fn = {};

    /*******************************
     * @config {Object}
     * @continueRequest {Boolean}
     * @return {Array}
     ******************************/
    fn.retrieve = function(config, continueRequest) {

        var reqID;
        var moreData = true;
        var continueRequest = continueRequest ? continueRequest : false;
        var obj = config.soapObjName ? config.soapObjName : null;
        var opts = config.opts ? config.opts : {};
        var props = config.props ? config.props : {};
        var filter = config.filter ? config.filter : {};
        var cols = config.cols ? config.cols : null;
        var mid = config.mid ? config.mid : null;
        prox = mid ? util.proxyContext(prox, mid) : prox;

        if (!config) { return 'configuration required'; }
        if (!obj) { return 'SOAP object is required'; }

        var resultsOut = [];

        // my script to set the values for function
        while (moreData) {
            moreData = false;
            if (reqID == null) {
                if (filter) {
                    var data = prox.retrieve(obj, cols, filter, opts, props);
                } else {
                    var data = prox.retrieve(obj, cols);
                }
            } else {
                var data = prox.getNextBatch(obj, reqID);
            }

            if (data != null) {

                if (continueRequest) {
                    moreData = data.HasMoreRows;
                    reqID = data.RequestID;
                }

                //my script to interact with results
                if (data && data.Results) {
                    for (var i = 0; i < data.Results.length; i++) {
                        resultsOut.push(data.Results[i]);
                    }
                }
            }
        }


        var res = {
            results: resultsOut
        }
        return res
    } // end retreive


    /*******************************
     * @config {Object}
     * @return {Object}
     ******************************/
    fn.create = function(config) {
        var obj = config.soapObjName ? config.soapObjName : null;
        var payload = config.payload ? config.payload : null;
        var mid = config.mid ? config.mid : null;
        prox = mid ? util.proxyContext(prox, mid) : prox;

        if (!config) { return 'configuration required'; }
        if (!obj) { return 'configuration required'; }
        if (!payload) { return 'payload is required'; }

        var batch = util.isArray(payload);

        if (batch) {
            var res = prox.createBatch(obj, payload);
        } else {
            var res = prox.createItem(obj, payload);
        }

        return res;
    } // end create

    /*******************************
     * @config {Object}
     * @return {Object}
     ******************************/
    fn.update = function(config) {
        var obj = config.soapObjName ? config.soapObjName : null;
        var payload = config.payload ? config.payload : null;
        var options = config.options ? config.options : null;
        var mid = config.mid ? config.mid : null;
        prox = mid ? util.proxyContext(prox, mid) : prox;

        if (!config) { return 'configuration required'; }
        if (!obj) { return 'SOAP object is required'; }
        if (!payload) { return 'payload is required'; }

        var batch = util.isArray(payload);

        if (batch) {
            var res = prox.updateBatch(obj, payload, options);
        } else {
            var res = prox.updateItem(obj, payload, options);
        }

        return res;
    } // end update


    /*******************************
     * @config {Object}
     * @return {Object}
     ******************************/
    fn.perform = function(config) {
        var obj = config.soapObjName ? config.soapObjName : null;
        var props = payload.props ? payload.props : {};
        var action = payload.action ? payload.action : {};
        var opts = payload.opts ? payload.opts : {};

        var mid = config.mid ? config.mid : null;
        prox = mid ? util.proxyContext(prox, mid) : prox;

        if (!config) { return 'configuration required'; }
        if (!obj) { return 'SOAP object is required'; }
        if (!payload) { return 'payload is required'; }

        var res = prox.performItem(obj, props, action, opts);
        return res;
    } // end perform

    return fn
}

</script>