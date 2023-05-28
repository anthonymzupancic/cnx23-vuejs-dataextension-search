<script runat="server">
Platform.Load("core", "1.1.1");

function util() {
    var fn = {}

    fn.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }
    
    
    fn.response = function(arg) {
        Write(Stringify(arg))
    }


    fn.proxyContext = function(prox, mid) {
        if (mid) {
            //reset previous settings
            prox.resetClientIds();
            // Set ClientID 
            prox.setClientId({
                "ID": mid
            });
        }
        return prox
    }


    fn.deBug = function(action, response, logExtKey, debug) {
        if (response) {
            debug ? Write("<br><b>" + action + ":</b><br> " + Stringify(response) + "<br><br>") : null;
        } else {
            debug ? Write("<br><b>" + action + "</b><br> ") : null;
        }

        if (logExtKey) {
            var log = {
                action: action ? action : null,
                log: response ? response : null
            }

            addLog(log, logExtKey);
        }
    }


    /***********************************************
     *
     *   function addLog()
     *   Pushes logging object to array to be written to a Data Extension
     *   
     *    @param obj {Object} logging object that matches the data extension
     *    @param logExtKey {String} External Key to log records to
     *    
     ***********************************************/
    fn.addLog = function(obj, logExtKey) {
        var logDE = DataExtension.Init(logExtKey);
        var logAction = logDE.Rows.Add(obj);
    };


    /***********************************************
     * 
     * function getDataExtensionKey()
     * Retieves the External Key for a SFMC Data Extension
     * 
     * @param name {String} Name of the data extension
     * @return {string} External Key of data extension
     * 
     ***********************************************/
    fn.getDataExtensionKey = function(name) {
        var de = DataExtension.Retrieve({
            Property: "Name",
            SimpleOperator: "equals",
            Value: name
        });

        var logKey = de[0].CustomerKey;

        return logKey;
    }


    /***********************************************
     * 
     * getFolderByName Function
     * @name {string} - name of data extension to retrieve
     * @contentType {string} - SFMC context: dataextension, ssjsactivity, asset,etc
     * 
    ***********************************************/
    fn.getFolderIDByName = function(config) {

    if(!config.name) {
        return 'folder name required'
    }

    if(!config.contentType) {
        return 'contentType is required'
    }


    if(!config.parentFolderName){
        var folderFilter = {
            LeftOperand: {
              Property: "Name",
              SimpleOperator: "equals",
              Value: config.name
            },
            LogicalOperator: "AND",
            RightOperand: {
              Property: "ContentType",
              SimpleOperator: "equals",
              Value: config.contentType
            }
          }
    } else {
        var folderFilter = {
            LeftOperand: {
              Property: "Name",
              SimpleOperator: "equals",
              Value: config.name
            },
            LogicalOperator: "AND",
            RightOperand: {
                LeftOperand: {
                    Property: "ParentFolder.Name",
                    SimpleOperator: "equals",
                    Value: config.parentFolderName
                  },
                  LogicalOperator: "AND",
                  RightOperand: {
                    Property: "ContentType",
                    SimpleOperator: "equals",
                    Value: config.contentType
                  }
            }
          }
    }


    var folderConfig = {
      soapObjName: "DataFolder",
      cols:["Name", "ID", "ParentFolder.ID", "ContentType", "ParentFolder.Name","ObjectID"],
      filter: folderFilter
    }

    if(config.mid){
        folderConfig.mid = config.mid
    }

    var res = wsRetrieve(folderConfig);
    var folderID = res.Results[0].ID;
    return folderID
  }

    
    fn.queryStringToJSON = function(url) {
        var query = url.split('?')[1] 
        var pairs = query.split('&');
        
        var result = {};
        for(var q = 0; q < pairs.length; q++){
            pair = pairs[q].split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        }

        return result;
    }
    
    return fn
}

</script>