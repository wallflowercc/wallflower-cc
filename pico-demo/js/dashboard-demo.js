// Network to display
var network_id = 'local';
var network = {
    "network-details": {
        "created-at": "2016-02-11T22:47:04.131000Z",
        "network-name": "Local Wallflower.cc Network"
    },
    "network-id": "local",
    "objects": {
        "alarm-clock-1": {
            "object-details": {
                "created-at": "2016-02-16T06:15:17.920000Z",
                "object-name": "Bedroom Alarm Clock",
                "updated-at": "2016-02-16T06:43:49.676000Z"
            },
            "object-id": "alarm-clock-1",
            "streams": {
                "alarm-setting-1": {
                    "points": [
                        {
                            "at": "2016-02-16T06:41:26.981000Z",
                            "value": "7:00:00"
                        }
                    ],
                    "points-details": {
                        "points-length": 0,
                        "points-type": "s"
                    },
                    "stream-details": {
                        "created-at": "2016-02-16T06:31:33.689000Z",
                        "stream-name": "Alarm One",
                        "stream-type": "data",
                        "updated-at": "2016-02-16T06:41:26.981000Z"
                    },
                    "stream-id": "alarm-setting-1"
                },
                "alarm-setting-2": {
                    "points": [
                        {
                            "at": "2016-02-16T06:42:01.348000Z",
                            "value": "7:45:00"
                        },
                        {
                            "at": "2016-02-16T06:41:50.183000Z",
                            "value": "7:30:00"
                        }
                    ],
                    "points-details": {
                        "points-length": 0,
                        "points-type": "s"
                    },
                    "stream-details": {
                        "created-at": "2016-02-16T06:37:27.261000Z",
                        "stream-name": "Alarm Two",
                        "stream-type": "data",
                        "updated-at": "2016-02-16T06:42:01.348000Z"
                    },
                    "stream-id": "alarm-setting-2"
                }
            }
        },
        "thermostat-main": {
            "object-details": {
                "created-at": "2016-02-16T06:38:17.356000Z",
                "object-name": "Thermostat"
            },
            "object-id": "thermostat-main",
            "streams": {
                "temp-sens": {
                    "points": [
                        {
                            "at": "2015-12-29T18:05:00.000000Z",
                            "value": 20.47
                        },
                        {
                            "at": "2015-12-29T18:00:00.000000Z",
                            "value": 20.47
                        },
                        {
                            "at": "2015-12-29T17:55:00.000000Z",
                            "value": 20.49
                        },
                        {
                            "at": "2015-12-29T17:50:00.000000Z",
                            "value": 20.51
                        },
                        {
                            "at": "2015-12-29T17:45:00.000000Z",
                            "value": 20.54
                        }
                    ],
                    "points-details": {
                        "max-value": 23.57,
                        "min-value": 17.71,
                        "points-length": 0,
                        "points-type": "f"
                    },
                    "stream-details": {
                        "created-at": "2016-02-23T21:44:29.997000Z",
                        "stream-name": "Temperature Sensor",
                        "stream-type": "data",
                        "updated-at": "2016-02-23T21:46:21.844000Z"
                    },
                    "stream-id": "temp-sens"
                }
            }
        }
    }
};

var url_params = {};

$('.datetimepicker').datetimepicker({
  format:'Y-m-d H:i:s T',
  onChangeDateTime:function(dp,$input){
    if(!!dp){
      $input.nextAll('p:first').text( 'Converted to ISO 8601 Format: '+dp.toISOString() );
    }else{
      $input.nextAll('p:first').text('');
    }
  }  
});




$(document).ready(function(){

  // Load sidebar
  loadViewSideBarNav();
  
  // Load the Highcharts element
  loadPointsPlot();
  
  
  /*
    Add functionality to the dashboard panel heading
  
  */
  $('#dashboard-panel-heading .panel').click(function(e) {
    // Prevent browser from opening link
    e.preventDefault();
    // Select current element
    var $this = $(this);
      var id = $this.attr('id');
      var id_array = id.split('-');
      var select = id_array[1];
      
      // Remove the class 'active' from all elements
      $('#dashboard-sidebar-nav a.active').removeClass('active');
      // Add the class 'active' to current element
      $('#dashboard-sidebar-nav a#sidebar-'+select).addClass('active');
      
      // Hide/Show pages
      $('div#wrapper div.page').addClass('hidden');
      $('div#wrapper div#page-'+select).removeClass('hidden');

      // Remove any alerts, if applicable
      $('.alert', $('div#wrapper div#page-'+select)).remove();
      
      
      if( select == 'dashboard' ){
        $('div#dashboard-sidebar-nav').addClass('hidden');
        $('div#page-wrapper').addClass('full-width');
      }else{
        $('div#dashboard-sidebar-nav').removeClass('hidden');
        $('div#page-wrapper').removeClass('full-width');
      }
      
      // Load the relevant forms
      if( select == 'view' ){
        $("div.page-view-object").addClass('hidden');
        $("div.page-view-stream").addClass('hidden');
        $("div.page-view-network").removeClass('hidden');
        
        $("div.page-view-network .network-name span").text( network['network-details']['network-name'] );
        $("div.page-view-network .network-id span").text( network['network-id'] );
        if ( network.hasOwnProperty("objects") ) {
          $("div.page-view-network .network-objects span").text( Object.keys( network.objects ).length );
        }
        else{
          $("div.page-view-network .network-objects span").text( 0 );
        }
      }
      else if( select == 'create' ){
        loadCreateStreamForms();
      }
      else if( select == 'update' ){
        loadUpdateObjectForms();
        loadUpdateStreamsForms();
        loadUpdatePointsForms();
      }
      else if( select == 'delete' ){
        loadDeleteObjectForms();
        loadDeleteStreamsForms();
      }
  });
  
  /*
    Add functionality to the sidebar
  
  */
  $('#dashboard-sidebar-nav ul:first a.first-level').click(function(e) {
    // Prevent browser from opening link
    e.preventDefault();
    // Select current element
    var $this = $(this);
      var id = $this.attr('id');
      var id_array = id.split('-');
      var select = id_array[1];
      
      // Remove the class 'active' from all elements
      $('#dashboard-sidebar-nav a.active').removeClass('active');
      // Add the class 'active' to current element
      $this.addClass('active');
      
      // Hide/Show pages
      $('div#wrapper div.page').addClass('hidden');
      $('div#wrapper div#page-'+select).removeClass('hidden');
      
      // Remove any alerts, if applicable
      $('.alert', $('div#wrapper div#page-'+select)).remove();
      
      if( select == 'dashboard' ){
        $('div#dashboard-sidebar-nav').addClass('hidden');
        $('div#page-wrapper').addClass('full-width');
      }else{
        $('div#dashboard-sidebar-nav').removeClass('hidden');
        $('div#page-wrapper').removeClass('full-width');
      }
      
      // Load the relevant forms
      if( select == 'view' ){
        $("div.page-view-object").addClass('hidden');
        $("div.page-view-stream").addClass('hidden');
        $("div.page-view-network").removeClass('hidden');
        
        $("div.page-view-network .network-name span").text( network['network-details']['network-name'] );
        $("div.page-view-network .network-id span").text( network['network-id'] );
        if ( network.hasOwnProperty("objects") ) {
          $("div.page-view-network .network-objects span").text( Object.keys( network.objects ).length );
        }
        else{
          $("div.page-view-network .network-objects span").text( 0 );
        }
      }
      else if( select == 'create' ){
        loadCreateStreamForms();
      }
      else if( select == 'update' ){
        loadUpdateObjectForms();
        loadUpdateStreamsForms();
        loadUpdatePointsForms();
      }
      else if( select == 'delete' ){
        loadDeleteObjectForms();
        loadDeleteStreamsForms();
      }
  });
  
  
  /*
    Add functionality to the view network form
  
  */
  $("form#form-view-network").submit(function(e){
    e.preventDefault();
    
    
    // (Pretend to) Send the request to the WCC server
    var this_form = $("form#form-view-network");
    var message = $('<div class="alert" style="margin-top:20px"></div>');
    var url = '/networks/'; 
    var req = $('<pre class="language-"><b>GET</b> '+url+'</pre>');
    
    // Start Success message
    message.addClass('alert-success');
    message.append("<h4>Success!</h4>");
    req.css({ 'color': '#3c763d' });
    
    var demo_text = 'This is not a live demo and so we did not actually send the request to a server. However, the example below shows the HTTP request and the JSON response that would have been returned by the Wallflower-Pico server.';
    message.append("<p style='color:#999'>"+demo_text+"</p>");
    
    // Add Request message
    message.append('<p>Request</p>');
    message.append( req );
    
    var response = clone(network);
    response['network-code'] = 200;
    response["network-message"] = "Network "+network_id+" Read";
    
    // Add Response message
    message.append('<p>Response</p>');
    var json_code = $('<pre class="language-javascript"><code class="language-javascript">'+JSON.stringify(response,null,4)+'</code></pre>');
    message.append( json_code );
    
    // Highlight JSON with Prism
    Prism.highlightElement(json_code[0]);
    
    // Add/Replace Alert message
    if ( $('.alert', this_form).length ) {
      $('.alert', this_form).replaceWith( message );
    }else{
      this_form.append(message);
    }

  });
  
  /*
    Add functionality to the view object form
  
  */
  $("form#form-view-object").submit(function(e){
    e.preventDefault();
    
    // Gather the data
    // and remove undefined keys(buttons)
    var data = {};
    $('input',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    })
    delete data["undefined"];
    
    // (Pretend to) Send the request to the WCC server

    var this_form = $("form#form-view-object");
    var message = $('<div class="alert" style="margin-top:20px"></div>');
    var url = '/networks/'+network_id+'/objects/'+data["object-id"];
    var req = $('<pre class="language-"><b>GET</b> '+url+'</pre>');
    
    // Start Success message
    message.addClass('alert-success');
    message.append("<h4>Success!</h4>");
    req.css({ 'color': '#3c763d' });          
    
    var demo_text = 'This is not a live demo and so we did not actually send the request to a server. However, the example below shows the HTTP request and the JSON response that would have been returned by the Wallflower-Pico server.';
    message.append("<p style='color:#999'>"+demo_text+"</p>");
    
    // Add Request message
    message.append('<p>Request</p>');
    message.append( req );
    
    var response = clone(network.objects[data["object-id"]]);
    response['network-id'] = network_id;
    response['object-code'] = 200;
    response["object-message"] = "Object "+network_id+"."+data["object-id"]+" Read";
    
    // Add Response message
    message.append('<p>Response</p>');
    var json_code = $('<pre class="language-javascript"><code class="language-javascript">'+JSON.stringify(response,null,4)+'</code></pre>');
    message.append( json_code );
    
    // Highlight JSON with Prism
    Prism.highlightElement(json_code[0]);
    
    // Add/Replace Alert message
    if ( $('.alert', this_form).length ) {
      $('.alert', this_form).replaceWith( message );
    }else{
      this_form.append(message);
    }
  });
  
  /*
    Add functionality to the view stream form
  
  */
  $("form#form-view-stream").submit(function(e){
    e.preventDefault();
    
    // Gather the data
    // and remove undefined keys(buttons)
    var data = {};
    $('input',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    })
    delete data["undefined"];
    
    // (Pretend to) Send the request to the WCC server
    var this_form = $("form#form-view-stream");
    var message = $('<div class="alert" style="margin-top:20px"></div>');
    var url = '/networks/'+network_id+'/objects/'+data["object-id"]+'/streams/'+data["stream-id"]
    var req = $('<pre class="language-"><b>GET</b> '+url+'</pre>');
    
    
    // Start Success message
    message.addClass('alert-success');
    message.append("<h4>Success!</h4>");
    req.css({ 'color': '#3c763d' });

    var demo_text = 'This is not a live demo and so we did not actually send the request to a server. However, the example below shows the HTTP request and the JSON response that would have been returned by the Wallflower-Pico server.';
    message.append("<p style='color:#999'>"+demo_text+"</p>");
    
    // Add Request message
    message.append('<p>Request</p>');
    message.append( req );
    
    var response = clone(network.objects[data["object-id"]].streams[data["stream-id"]]);
    response['network-id'] = network_id;
    response['object-id'] = data["object-id"];
    response['stream-code'] = 200;
    response["stream-message"] = "Stream "+network_id+"."+data["object-id"]+"."+data["stream-id"]+" Read";
    
    // Add Response message
    message.append('<p>Response</p>');
    var json_code = $('<pre class="language-javascript"><code class="language-javascript">'+JSON.stringify(response,null,4)+'</code></pre>');
    message.append( json_code );
    
    // Highlight JSON with Prism
    Prism.highlightElement(json_code[0]);
    
    // Add/Replace Alert message
    if ( $('.alert', this_form).length ) {
      $('.alert', this_form).replaceWith( message );
    }else{
      this_form.append(message);
    }

  });
  
  /*
    Add functionality to the view points form
  
  */
  $("form#form-view-points").submit(function(e){
    e.preventDefault();
    
    // Gather the data
    // and remove undefined keys(buttons)
    var data = {};
    $('input',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
      if( data[input.attr("name")] == ''){
        delete data[input.attr("name")];
      }
    });
    delete data["undefined"];
    
    
    // Form Validation goes here....
    try{
      var at = new Date( data["points-start"] );
      data["points-start"] = at.toISOString();
    }catch(err){
      delete data["points-start"]; 
    }
    try{
      var at = new Date( data["points-end"] );
      data["points-end"] = at.toISOString();
    }catch(err){
      delete data["points-end"];
    }
    
    
    // Don't include ids in query string
    object_id = data["object-id"]; 
    delete data["object-id"]; 
    stream_id = data["stream-id"]; 
    delete data["stream-id"]; 
    
    var query = '';
    if( Object.keys(data).length > 0 ){
      query = '?'+$.param(data);
    }
    
    // (Pretend to) Send the request to the WCC server
    var this_form = $("form#form-view-points");
    var message = $('<div class="alert" style="margin-top:20px"></div>');
    var url = '/networks/'+network_id+'/objects/'+object_id+'/streams/'+stream_id+'/points'+query
    var req = $('<pre class="language-"><b>GET</b> '+url+'</pre>');
    
    // Start Success message
    message.addClass('alert-success');
    message.append("<h4>Success!</h4>");
    req.css({ 'color': '#3c763d' });
    
    var demo_text = 'This is not a live demo and so we did not actually send the request to a server. However, the example below shows the HTTP request and the JSON response that may have been returned by the Wallflower-Pico server.';
    message.append("<p style='color:#999'>"+demo_text+"</p>");
    
    // Add Request message
    message.append('<p>Request</p>');
    message.append( req );
    
    var response = clone(network.objects[object_id].streams[stream_id]);
    delete response['stream-details'];
    response['network-id'] = network_id;
    response['object-id'] = object_id;
    response['points-code'] = 200;
    response["points-message"] = "Points "+network_id+"."+object_id+"."+stream_id+".points Read";
    
    // Add Response message
    message.append('<p>Response</p>');
    var json_code = $('<pre class="language-javascript"><code class="language-javascript">'+JSON.stringify(response,null,4)+'</code></pre>');
    message.append( json_code );
    
    // Highlight JSON with Prism
    Prism.highlightElement(json_code[0]);
    
    // Add/Replace Alert message
    if ( $('.alert', this_form).length ) {
      $('.alert', this_form).replaceWith( message );
    }else{
      this_form.append(message);
    }

  });
  
  
  /*
    Add functionality to the create object form
  
  */
  $("form#form-create-object").submit(function(e){
    e.preventDefault();
    
    // Gather the data
    // and remove undefined keys(buttons)
    var data = {};
    $('input',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    })
    delete data["undefined"];
    
    
    // Form Validation goes here....
    
    // Remove prohibited characters from object id
    object_id = data["object-id"].replace(/[^a-z0-9\-\_]/gi,'');
    if( object_id.length != data["object-id"].length ){
      $("form#form-create-object input[name='oi']").val( object_id );
    }
    
    // Don't include id in query string
    delete data["object-id"]; 
    
    // (Pretend to) Send the request to the WCC server
    var this_form = $("form#form-create-object");
    var message = $('<div class="alert" style="margin-top:20px"></div>');
    var url = '/networks/'+network_id+'/objects/'+object_id+'?'+$.param(data);
    var req = $('<pre class="language-"><b>PUT</b> '+url+'</pre>');
    

    var response = {};
    
    if( object_id in network.objects ){
      response = clone(network.objects[object_id]);
      
      message.addClass('alert-info');
      message.append("<h4>Request Not Completed</h4>");
      req.css({ 'color': '#31708f' });
      
      response['network-id'] = network_id;
      response['object-id'] = object_id;
      delete response['streams'];
      delete response['object-details'];
      response['object-code'] = 304;
      response["object-message"] = "Object "+network_id+"."+object_id+" already exists. No changes made.";
      
    }else{
      // Start Success message
      message.addClass('alert-success');
      message.append("<h4>Success!</h4>");
      req.css({ 'color': '#3c763d' });
      
      response['network-id'] = network_id;
      response['object-id'] = object_id;
      response['object-details'] = {};
      response['object-details']["object-name"] = data['object-name'];
      response['object-details']["created-at"] = (new Date()).toISOString();
      response['object-code'] = 201;
      response["object-message"] = "Object "+network_id+"."+object_id+" Created";
      
      // Add new object to client-side
      var new_object = {
        'object-id': response['object-id'],
        'object-details': response['object-details'],
        'streams': {}
      }
      network['objects'][response['object-id']] = new_object;
      
      
      // Reload the create stream form
      loadCreateStreamForms();
      // Reload Side Bar
      loadViewSideBarNav();
      // Clear the create object form
      this_form.trigger("reset");
    }
      
    var demo_text = 'This is not a live demo and so we did not actually send the request to a server. However, the example below shows the HTTP request and the JSON response that would have been returned by the Wallflower-Pico server.';
    message.append("<p style='color:#999'>"+demo_text+"</p>");

    // Add Request message
    message.append('<p>Request</p>');
    message.append( req );
    
    // Add Response message
    message.append('<p>Response</p>');
    var json_code = $('<pre class="language-javascript"><code class="language-javascript">'+JSON.stringify(response,null,4)+'</code></pre>');
    message.append( json_code );
    
    // Highlight JSON with Prism
    Prism.highlightElement(json_code[0]);
    
    // Add/Replace Alert message
    if ( $('.alert', this_form).length ) {
      $('.alert', this_form).replaceWith( message );
    }else{
      this_form.append(message);
    }

  });
  
  /*
    Add functionality to the create stream form
  
  */
  $("form#form-create-stream").submit(function(e){
    e.preventDefault();
    
    // Gather the data
    // and remove undefined keys(buttons)
    var data = {};
    $('input',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    });
    $('select',this).each( function(i, v){      
      var input = $(v);
      data[input.attr("name")] = input.val();
    });    
    delete data["undefined"];
    
    
    // Form Validation goes here....
    
    // Remove prohibited characters from stream id
    stream_id = data["stream-id"].replace(/[^a-z0-9\-\_]/gi,'');
    if( stream_id.length != data["stream-id"].length ){
      $("form#form-create-stream input[name='si']").val( stream_id );
    }
    
    // Don't include ids in query string
    object_id = data["object-id"]; 
    delete data["object-id"]; 
    delete data["stream-id"]; 
    
    // (Pretend to) Send the request to the WCC server
    var this_form = $("form#form-create-stream");
    var message = $('<div class="alert" style="margin-top:20px"></div>');
    var url = '/networks/'+network_id+'/objects/'+object_id+'/streams/'+stream_id+'?'+$.param(data);
    var req = $('<pre class="language-"><b>PUT</b> '+url+'</pre>');
    

    var response = {};
    
    if( stream_id in network.objects[object_id].streams ){
      response = clone(network.objects[object_id].streams[stream_id]);
      
      message.addClass('alert-info');
      message.append("<h4>Request Not Completed</h4>");
      req.css({ 'color': '#31708f' });
      
      response['network-id'] = network_id;
      response['object-id'] = object_id;
      response['stream-id'] = stream_id;
      delete response['points'];
      delete response['points-details'];
      delete response['stream-details'];
      response['stream-code'] = 304;
      response["stream-message"] = "Stream "+network_id+"."+object_id+"."+stream_id+" already exists. No changes made.";
      
    }else{
      // Start Success message
      message.addClass('alert-success');
      message.append("<h4>Success!</h4>");
      req.css({ 'color': '#3c763d' });
      
      response['network-id'] = network_id;
      response['object-id'] = object_id;
      response['stream-id'] = stream_id;
      response['stream-details'] = {};
      response['stream-details']["stream-name"] = data['stream-name'];
      response['stream-details']["created-at"] = (new Date()).toISOString();
      response['points-details'] = {};
      response['points-details']["points-type"] = data['points-type'];
      response['stream-code'] = 201;
      response["stream-message"] = "Stream "+network_id+"."+object_id+"."+stream_id+" Created";
      
      // Add new object to client-side
      var new_stream = {
        'stream-id': response['stream-id'],
        'stream-details': response['stream-details'],
        'points-details': response['points-details'],
        'points': []
      }
      network['objects'][response["object-id"]]['streams'][response['stream-id']] = new_stream;
      
      
      // Reload Side Bar
      loadViewSideBarNav();
      // Clear the create object form
      this_form.trigger("reset");
    }
      
    var demo_text = 'This is not a live demo and so we did not actually send the request to a server. However, the example below shows the HTTP request and the JSON response that would have been returned by the Wallflower-Pico server.';
    message.append("<p style='color:#999'>"+demo_text+"</p>");

    // Add Request message
    message.append('<p>Request</p>');
    message.append( req );
    
    // Add Response message
    message.append('<p>Response</p>');
    var json_code = $('<pre class="language-javascript"><code class="language-javascript">'+JSON.stringify(response,null,4)+'</code></pre>');
    message.append( json_code );
    
    // Highlight with Prism
    Prism.highlightElement(json_code[0] );
    
    // Add/Replace Alert message
    if ( $('.alert', this_form).length ) {
      $('.alert', this_form).replaceWith( message );
    }else{
      this_form.append(message);
    }
  });
  
  
  /*
    Add functionality to the update object form
  
  */
  $("form#form-update-object").submit(function(e){
    e.preventDefault();
    
    // Gather the data
    // and remove undefined keys(buttons)
    var data = {};
    $('input',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    });
    $('select',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    });
    delete data["undefined"];
    
    
    // Form Validation goes here....
    
    
    // Don't include id in query string
    var object_id = data["object-id"]; 
    delete data["object-id"]; 
    
    // (Pretend to) Send the request to the WCC server
    var this_form = $("form#form-update-object");
    var message = $('<div class="alert" style="margin-top:20px"></div>');
    var url = '/networks/'+network_id+'/objects/'+object_id+'?'+$.param(data);
    var req = $('<pre class="language-"><b>POST</b> '+url+'</pre>');
    
    // Start Success message
    message.addClass('alert-success');
    message.append("<h4>Success!</h4>");
    req.css({ 'color': '#3c763d' });
    
    var response = {};
    response['network-id'] = network_id;
    response['object-id'] = object_id;
    response['object-details'] = {};
    response['object-details']["object-name"] = data['object-name'];
    response['object-details']["updated-at"] = (new Date()).toISOString();
    response['object-code'] = 200;
    response["object-message"] = "Object "+network_id+"."+object_id+" Updated";
    
    // Update client-side object details
    for ( var object_details_id in response['object-details'] ){
      network['objects'][response['object-id']]['object-details'][object_details_id] = response['object-details'][object_details_id];
    }

    // Reload Side Bar
    loadViewSideBarNav();
    
    var demo_text = 'This is not a live demo and so we did not actually send the request to a server. However, the example below shows the HTTP request and the JSON response that would have been returned by the Wallflower-Pico server.';
    message.append("<p style='color:#999'>"+demo_text+"</p>");
    
    // Add Request message
    message.append('<p>Request</p>');
    message.append( req );
    
    // Add Response message
    message.append('<p>Response</p>');
    json_code = $('<pre class="language-javascript"><code class="language-javascript">'+JSON.stringify(response,null,4)+'</code></pre>');
    message.append( json_code );
    
    // Highlight with Prism
    Prism.highlightElement(json_code[0] );
    
    // Add/Replace Alert message
    if ( $('.alert', this_form).length ) {
      $('.alert', this_form).replaceWith( message );
    }else{
      this_form.append(message);
    }
      
  });
  
  /*
    Add functionality to the update create form
  
  */
  $("form#form-update-stream").submit(function(e){
    e.preventDefault();
    
    // Gather the data
    // and remove undefined keys(buttons)
    var data = {}
    $('input',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    });
    $('select',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    });
    delete data["undefined"];
    
    
    // Form Validation goes here....
    
    
    // Don't include ids in query string
    object_id = data["object-id"]; 
    delete data["object-id"]; 
    stream_id = data["stream-id"]; 
    delete data["stream-id"]; 
    
    // (Pretend to) Send the request to the WCC server
    var this_form = $("form#form-update-stream");
    var message = $('<div class="alert" style="margin-top:20px"></div>');
    var url = '/networks/'+network_id+'/objects/'+object_id+'/streams/'+stream_id+'?'+$.param(data);
    var req = $('<pre class="language-"><b>POST</b> '+url+'</pre>');
    
    // Start Success message
    message.addClass('alert-success');
    message.append("<h4>Success!</h4>");
    req.css({ 'color': '#3c763d' });
    
    var response = {};
    response['network-id'] = network_id;
    response['object-id'] = object_id;
    response['stream-id'] = stream_id;
    response['stream-details'] = {};
    response['stream-details']["stream-name"] = data['stream-name'];
    response['stream-details']["updated-at"] = (new Date()).toISOString();
    response['stream-code'] = 200;
    response["stream-message"] = "Stream "+network_id+"."+object_id+"."+stream_id+" Updated";
    
    // Update client-side object details
    for ( var stream_details_id in response['stream-details'] ){
      network['objects'][response['object-id']]['streams'][response['stream-id']]['stream-details'][stream_details_id] = response['stream-details'][stream_details_id];
    }

    // Reload Side Bar
    loadViewSideBarNav();
    
    var demo_text = 'This is not a live demo and so we did not actually send the request to a server. However, the example below shows the HTTP request and the JSON response that would have been returned by the Wallflower-Pico server.';
    message.append("<p style='color:#999'>"+demo_text+"</p>");
    
    // Add Request message
    message.append('<p>Request</p>');
    message.append( req );
    
    // Add Response message
    message.append('<p>Response</p>');
    json_code = $('<pre class="language-javascript"><code class="language-javascript">'+JSON.stringify(response,null,4)+'</code></pre>');
    message.append( json_code );
    
    // Highlight with Prism
    Prism.highlightElement(json_code[0] );
    
    // Add/Replace Alert message
    if ( $('.alert', this_form).length ) {
      $('.alert', this_form).replaceWith( message );
    }else{
      this_form.append(message);
    }
    
  });
  
  /*
    Add functionality to the update points form
  
  */
  $("form#form-update-points").submit(function(e){
    e.preventDefault();

    // Gather the data
    // and remove undefined keys(buttons)
    var data = {};
    $('input',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    });
    $('select',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    });
    delete data["undefined"];

    // Form Validation goes here....
    var points_type = network.objects[data["object-id"]].streams[data["stream-id"]]['points-details']['points-type'];
    if( points_type == 'f' ){
      data["points-value"] = parseFloat( data["points-value"] );
    }else if( points_type == 'i' ){
      data["points-value"] = parseInt( data["points-value"] );
    }
    
    try{
      var at = new Date( data["points-at"] );
      data["points-at"] = at.toISOString();
    }catch(err){
      data["points-at"] = (new Date()).toISOString();
    }

    
    // Check point value
    if( points_type == 'f' && data["points-value"] === +data["points-value"] && data["points-value"] !== (data["points-value"]|0) ){
      // Point value is float. Do nothing.
    }
    else if( points_type == 'f' && data["points-value"] === +data["points-value"] && data["points-value"] === (data["points-value"]|0) ){
      // Expected float but got integer. We will accept it.
    }
    else if( points_type == 'i' && data["points-value"] === +data["points-value"] && data["points-value"] === (data["points-value"]|0) ){
      // Point value is integer. Do nothing.
    }
    else if( points_type == 's' && (typeof data["points-value"] === 'string' || data["points-value"] instanceof String) ){
      // Point value is string. Do nothing.
    }else{
      // Something is wrong.
      return
    }
    
    // Don't include ids in query string
    object_id = data["object-id"]; 
    delete data["object-id"]; 
    stream_id = data["stream-id"]; 
    delete data["stream-id"]; 
    
    // (Pretend to) Send the request to the WCC server
    var this_form = $("form#form-update-points");
    var message = $('<div class="alert" style="margin-top:20px"></div>');
    var url = '/networks/'+network_id+'/objects/'+object_id+'/streams/'+stream_id+'?'+$.param(data);
    var req = $('<pre class="language-"><b>POST</b> '+url+'</pre>');
    
    // Start Success message
    message.addClass('alert-success');
    message.append("<h4>Success!</h4>");
    req.css({ 'color': '#3c763d' });
    
    var response = {};
    response['network-id'] = network_id;
    response['object-id'] = object_id;
    response['stream-id'] = stream_id;
    response['points'] = [{
      'at': data["points-at"],
      'value': data["points-value"]
    }];
    response['points-code'] = 200;
    response["points-message"] = "Points "+network_id+"."+object_id+"."+stream_id+".points Updated";
    
    // Update client-side points
    point = {
      'at': data["points-at"],
      'value': data["points-value"]
    }
    network['objects'][response['object-id']]['streams'][response['stream-id']]['points'].unshift( point );

    // Reload Side Bar
    loadViewSideBarNav();
    
    var demo_text = 'This is not a live demo and so we did not actually send the request to a server. However, the example below shows the HTTP request and the JSON response that would have been returned by the Wallflower-Pico server.';
    message.append("<p style='color:#999'>"+demo_text+"</p>");
    
    // Add Request message
    message.append('<p>Request</p>');
    message.append( req );
    
    // Add Response message
    message.append('<p>Response</p>');
    json_code = $('<pre class="language-javascript"><code class="language-javascript">'+JSON.stringify(response,null,4)+'</code></pre>');
    message.append( json_code );
    
    // Highlight with Prism
    Prism.highlightElement( json_code[0] );
    
    // Add/Replace Alert message
    if ( $('.alert', this_form).length ) {
      $('.alert', this_form).replaceWith( message );
    }else{
      this_form.append(message);
    }
  });
  
  
  // Make object update form interactive
  $('#form-update-object select[name="object-id"]').change( function(e){
    // Remove alert, if applicable
    $('#form-update-object .alert').remove();
    // Set object name field given selected object
    var selected_object_id = $( "option:selected", this ).val();
    $('#form-update-object input[name="object-name"]').val( network.objects[selected_object_id]['object-details']['object-name'] );
  });
  
  
  // Make stream update form interactive
  $('#form-update-stream select[name="object-id"]').change( function(e){
    // Remove alert, if applicable
    $('#form-update-stream .alert').remove();
    
    // Clear the stream id option
    $('#form-update-stream select[name="stream-id"] option').remove();
    
    var selected_object_id = $( "option:selected", this ).val();
    if( selected_object_id in network.objects && 
        network.objects[selected_object_id].hasOwnProperty("streams") && 
        Object.keys( network.objects[selected_object_id].streams ).length > 0 ) {
      
      // Populate the stream id option
      $("#form-conditional-update-stream").removeClass('hidden');
      for ( var stream_id in network.objects[selected_object_id].streams ){
        $('#form-update-stream select[name="stream-id"]').append('<option value="'+stream_id+'">'+stream_id+'</option>');
      }
      
      // Set stream name field given selected object and stream
      var selected_stream_id = $( "option:selected", $('#form-update-stream select[name="stream-id"]') ).val();
      if ( typeof selected_stream_id !== "undefined" ){
        $('#form-update-stream input[name="stream-name"]').val( network.objects[selected_object_id].streams[selected_stream_id]['stream-details']['stream-name'] );
      }
    }else{
      $("#form-conditional-update-stream").addClass('hidden');
    }
  });
  
  $('#form-update-stream select[name="stream-id"]').change( function(e){
    // Remove alert, if applicable
    $('#form-update-stream .alert').remove();
    // Set stream name field given selected object and stream
    var selected_object_id = $( 'option:selected', $('#form-update-stream select[name="object-id"]') ).val();
    var selected_stream_id = $( "option:selected", this ).val();
    $('#form-update-stream input[name="stream-name"]').val( network.objects[selected_object_id].streams[selected_stream_id]['stream-details']['stream-name'] );
  });
  
  
  // Make points update form interactive
  $('#form-update-points select[name="object-id"]').change( function(e){
    // Remove alert, if applicable
    $('#form-update-points .alert').remove();
    
    // Clear the stream id option
    $('#form-update-points select[name="stream-id"] option').remove();
    
    var selected_object_id = $( "option:selected", this ).val();
    if( selected_object_id in network.objects && 
        network.objects[selected_object_id].hasOwnProperty("streams") && 
        Object.keys( network.objects[selected_object_id].streams ).length > 0 ) {
      
      // Populate the stream id option
      $("#form-conditional-update-points").removeClass('hidden');
      for ( var stream_id in network.objects[selected_object_id].streams ){
        $('#form-update-points select[name="stream-id"]').append('<option value="'+stream_id+'">'+stream_id+'</option>');
      }
      
      // Set the type of the point value field given selected object and stream
      var selected_stream_id = $( "option:selected", $('#form-update-points select[name="stream-id"]') ).val();
      var points_type = network.objects[selected_object_id].streams[selected_stream_id]['points-details']['points-type'];
      if( points_type == 'f' ){
        // Float
        $('#form-update-points p.help-block[for="points-value"]').html("Value must be a <b>float</b>");
        $('#form-update-points input[name="points-value"]').attr('type', 'number');
        $('#form-update-points input[name="points-value"]').attr('step', 'any');
      }else if( points_type == 's' ){
        // String
        $('#form-update-points p.help-block[for="points-value"]').html("Value must be a <b>string</b>");
        $('#form-update-points input[name="points-value"]').attr('type', 'text');
        $('#form-update-points input[name="points-value"]').removeAttr('step');
      }else{
        // Integer
        $('#form-update-points p.help-block[for="points-value"]').html("Value must be an <b>integer</b>");
        $('#form-update-points input[name="points-value"]').attr('type', 'number');
        $('#form-update-points input[name="points-value"]').attr('step', '1');
      }
    }else{
      $("#form-conditional-update-points").addClass('hidden');
    }
  });
  
  $('#form-update-points select[name="stream-id"]').change( function(e){
    // Remove alert, if applicable
    $('#form-update-points .alert').remove();
    
    // Set the type of the point value field given selected object and stream
    var selected_object_id = $( 'option:selected', $('#form-update-points select[name="object-id"]') ).val();
    var selected_stream_id = $( "option:selected", this ).val();
    var points_type = network.objects[selected_object_id].streams[selected_stream_id]['points-details']['points-type'];
    if( points_type == 'f' ){
      // Float
      $('#form-update-points p.help-block[for="points-value"]').html("Value must be a <b>float</b>");
      $('#form-update-points input[name="points-value"]').attr('type', 'number');
      $('#form-update-points input[name="points-value"]').attr('step', 'any');
    }else if( points_type == 's' ){
      // String
      $('#form-update-points p.help-block[for="points-value"]').html("Value must be a <b>string</b>");
      $('#form-update-points input[name="points-value"]').attr('type', 'text');
      $('#form-update-points input[name="points-value"]').removeAttr('step');
    }else{
      // Integer
      $('#form-update-points p.help-block[for="points-value"]').html("Value must be an <b>integer</b>");
      $('#form-update-points input[name="points-value"]').attr('type', 'number');
      $('#form-update-points input[name="points-value"]').attr('step', '1');
    }
  });
  
  
  /*
    Add functionality to the delete object form
  
  */
  $("form#form-delete-object").submit(function(e){
    e.preventDefault();
    
    // Hide the delete warning modal
    $('#modal-delete-object').modal('hide');
    
    // Gather the data
    // and remove undefined keys(buttons)
    var data = {};
    $('select',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    });
    delete data["undefined"];
    
    
    // Form Validation goes here....
    
    
    // (Pretend to) Send the request to the WCC server
    var this_form = $("form#form-delete-object");
    var message = $('<div class="alert" style="margin-top:20px"></div>');
    var url = '/networks/'+network_id+'/objects/'+data['object-id'];
    var req = $('<pre class="language-"><b>DELETE</b> '+url+'</pre>');
    
    // Start Success message
    message.addClass('alert-success');
    message.append("<h4>Success!</h4>");
    req.css({ 'color': '#3c763d' });
    
    var response = {};
    response['network-id'] = network_id;
    response['object-id'] = data['object-id'];
    response['object-code'] = 200;
    response["object-message"] = "Object "+network_id+"."+data['object-id']+" Deleted";
    
    // Delete object from client-side record
    delete network['objects'][response['object-id']];

    // Reload the object and stream delete forms
    loadDeleteObjectForms();
    loadDeleteStreamsForms();
    // Reload Side Bar
    loadViewSideBarNav();
    
    var demo_text = 'This is not a live demo and so we did not actually send the request to a server. However, the example below shows the HTTP request and the JSON response that would have been returned by the Wallflower-Pico server.';
    message.append("<p style='color:#999'>"+demo_text+"</p>");
    
    // Add Request message
    message.append('<p>Request</p>');
    message.append( req );
    
    // Add Response message
    message.append('<p>Response</p>');
    var json_code = $('<pre class="language-javascript"><code class="language-javascript">'+JSON.stringify(response,null,4)+'</code></pre>');
    message.append( json_code );
    
    // Highlight JSON with Prism
    Prism.highlightElement(json_code[0]);
    
    // Add/Replace Alert message
    if ( $('.alert', this_form).length ) {
      $('.alert', this_form).replaceWith( message );
    }else{
      this_form.append(message);
    }

  });
  
  /*
    Add functionality to the delete stream form
  
  */
  $("form#form-delete-stream").submit(function(e){
    e.preventDefault();
    
    // Hide the delete warning modal
    $('#modal-delete-stream').modal('hide');
    
    // Gather the data
    // and remove undefined keys(buttons)
    var data = {};
    $('select',this).each( function(i, v){
      var input = $(v);
      data[input.attr("name")] = input.val();
    });
    delete data["undefined"];
    
    
    // Form Validation goes here....
    
    
    // (Pretend to) Send the request to the WCC server
    var this_form = $("form#form-delete-stream");
    var message = $('<div class="alert" style="margin-top:20px"></div>');
    var url = '/networks/'+network_id+'/objects/'+data['object-id']+'/streams/'+data['stream-id'];
    var req = $('<pre class="language-"><b>DELETE</b> '+url+'</pre>');
    
    // Start Success message
    message.addClass('alert-success');
    message.append("<h4>Success!</h4>");
    req.css({ 'color': '#3c763d' });
    
    var response = {};
    response['network-id'] = network_id;
    response['object-id'] = data['object-id'];
    response['stream-id'] = data['stream-id'];
    response['stream-code'] = 200;
    response["stream-message"] = "Stream "+network_id+"."+data['object-id']+"."+data['stream-id']+" Deleted";
    
    // Delete stream from client-side record
    delete network['objects'][response['object-id']]['streams'][response['stream-id']];
    
    // Reload the stream delete form
    loadDeleteStreamsForms();
    // Reload Side Bar
    loadViewSideBarNav();

    var demo_text = 'This is not a live demo and so we did not actually send the request to a server. However, the example below shows the HTTP request and the JSON response that would have been returned by the Wallflower-Pico server.';
    message.append("<p style='color:#999'>"+demo_text+"</p>");
    
    // Add Request message
    message.append('<p>Request</p>');
    message.append( req );
    
    // Add Response message
    message.append('<p>Response</p>');
    var json_code = $('<pre class="language-javascript"><code class="language-javascript">'+JSON.stringify(response,null,4)+'</code></pre>');
    message.append( json_code );
    
    // Highlight with Prism
    Prism.highlightElement( json_code[0] );
      
    // Add/Replace Alert message
    if ( $('.alert', this_form).length ) {
      $('.alert', this_form).replaceWith( message );
    }else{
      this_form.append(message);
    }
    
    
  });
  
  
  // Make object delete form interactive
  $('#form-delete-object select[name="object-id"]').change( function(e){
    // Remove alert, if applicable
    $('#form-delete-object .alert').remove();
    // Set warning message
    var selected_object_id = $( "option:selected", this ).val();
    var object = network_id+'.'+selected_object_id;
    var message = $("<p>Do you want to delete "+object+"?</p>\
    <p>All associated streams and points will also be deleted.</p>\
    <p>This action cannot be undone.</p>");
    $("#modal-body-delete-object").html( message );
  });
  
  
  // Make stream delete form interactive
  $('#form-delete-stream select[name="object-id"]').change( function(e){
    // Remove alert, if applicable
    $('#form-delete-stream .alert').remove();

    // Clear the stream id option
    $('#form-delete-stream select[name="stream-id"] option').remove();
    
    var selected_object_id = $( "option:selected", this ).val();
    if( selected_object_id in network.objects && 
        network.objects[selected_object_id].hasOwnProperty("streams") && 
        Object.keys( network.objects[selected_object_id].streams ).length > 0 ) {
      
      // Populate the stream id option
      $("#form-conditional-delete-stream").removeClass('hidden');
      for ( var stream_id in network.objects[selected_object_id].streams ){
        $('#form-delete-stream select[name="stream-id"]').append('<option value="'+stream_id+'">'+stream_id+'</option>');
      }
      // Set warning message
      var selected_stream_id = $( "option:selected", $('#form-delete-stream select[name="stream-id"]') ).val();
      var stream = network_id+'.'+selected_object_id+"."+selected_stream_id;
      var message = $("<p>Do you want to delete "+stream+"?</p>\
      <p>All associated points will also be deleted.</p>\
      <p>This action cannot be undone.</p>");
      $("#modal-body-delete-stream").html( message );
      
    }else{
      $("#form-conditional-delete-stream").addClass('hidden');
    }
  });
  
  $('#form-delete-stream select[name="stream-id"]').change( function(e){
    // Remove alert, if applicable
    $('#form-delete-stream .alert').remove();
    // Set warning message
    var selected_object_id = $( 'select[name="object-id"] option:selected' ).val();
    var selected_stream_id = $( "option:selected", this ).val();
    var stream = network_id+'.'+selected_object_id+"."+selected_stream_id;
    var message = $("<p>Do you want to delete "+stream+"?</p>\
    <p>All associated points will also be deleted.</p>\
    <p>This action cannot be undone.</p>");
    $("#modal-body-delete-stream").html( message );
  });
  
  
});

// Initialize/reload the create stream form
function loadCreateStreamForms(){
  // Clear the object id option
  $('#form-create-stream select[name="object-id"] option').remove();
  // Populate the object id option
  if ( network.hasOwnProperty("objects") ) {
    for ( var object_id in network.objects ){
      $('#form-create-stream select[name="object-id"]').append('<option value="'+object_id+'">'+object_id+'</option>');
    }
  }
}

// Initialize/reload the update object form
function loadUpdateObjectForms(){
  // Clear the object id option
  $('#form-update-object select[name="object-id"] option').remove();
  // Populate the object id option
  if ( network.hasOwnProperty("objects") ) {
    for ( var object_id in network.objects ){
      $('#form-update-object select[name="object-id"]').append('<option value="'+object_id+'">'+object_id+'</option>');
    }
  }
  // Set object name field given selected object
  var selected_object_id = $( "option:selected", $('#form-update-object select') ).val();
  $('#form-update-object input[name="object-name"]').val( network.objects[selected_object_id]['object-details']['object-name'] );
}

// Initialize/reload the update stream form
function loadUpdateStreamsForms(){
  // Clear the object id and stream id options
  $('#form-update-stream select[name="object-id"] option').remove();
  $('#form-update-stream select[name="stream-id"] option').remove();
  
  if ( network.hasOwnProperty("objects") ) {
    // Populate the object id option
    for ( var object_id in network.objects ){
      $('#form-update-stream select[name="object-id"]').append('<option value="'+object_id+'">'+object_id+'</option>');
    }
    
    var selected_object_id = $( "option:selected", $('#form-update-stream select[name="object-id"]') ).val();
    if( selected_object_id in network.objects && 
        network.objects[selected_object_id].hasOwnProperty("streams") && 
        Object.keys( network.objects[selected_object_id].streams ).length > 0 ) {
      
      // Show stream portion of form
      $("#form-conditional-update-stream").removeClass('hidden');
      
      // Populate the stream id option
      for ( var stream_id in network.objects[selected_object_id].streams ){
        $('#form-update-stream select[name="stream-id"]').append('<option value="'+stream_id+'">'+stream_id+'</option>');
      }
      // Set stream name field given selected object and stream
      var selected_stream_id = $( "option:selected", $('#form-update-stream select[name="stream-id"]') ).val();
      $('#form-update-stream input[name="stream-name"]').val( network.objects[selected_object_id].streams[selected_stream_id]['stream-details']['stream-name'] );
    }else{
      $("#form-conditional-update-stream").addClass('hidden');
    }
  }
}

// Initialize/reload the update points form
function loadUpdatePointsForms(){
  // Clear the object id and stream id options
  $('#form-update-points select[name="object-id"] option').remove();
  $('#form-update-points select[name="stream-id"] option').remove();
  
  if ( network.hasOwnProperty("objects") ) {
    // Populate the object id option
    for ( var object_id in network.objects ){
      $('#form-update-points select[name="object-id"]').append('<option value="'+object_id+'">'+object_id+'</option>');
    }
    
    var selected_object_id = $( "option:selected", $('#form-update-points select[name="object-id"]') ).val();
    if( selected_object_id in network.objects && 
        network.objects[selected_object_id].hasOwnProperty("streams") && 
        Object.keys( network.objects[selected_object_id].streams ).length > 0 ) {
      
      // Show streams portion of form
      $("#form-conditional-update-points").removeClass('hidden');
      
      // Populate the stream id option
      for ( var stream_id in network.objects[selected_object_id].streams ){
        $('#form-update-points select[name="stream-id"]').append('<option value="'+stream_id+'">'+stream_id+'</option>');
      }
      
      // Set the type of the point value field given selected object and stream
      var selected_stream_id = $( "option:selected", $('#form-update-points select[name="stream-id"]') ).val();
      var points_type = network.objects[selected_object_id].streams[selected_stream_id]['points-details']['points-type'];
      if( points_type == 'f' ){
        // Float
        $('#form-update-points p.help-block[for="points-value"]').html("Value must be a <b>float</b>");
        $('#form-update-points input[name="points-value"]').attr('type', 'number');
        $('#form-update-points input[name="points-value"]').attr('step', 'any');
      }else if( points_type == 's' ){
        // String
        $('#form-update-points p.help-block[for="points-value"]').html("Value must be a <b>string</b>");
        $('#form-update-points input[name="points-value"]').attr('type', 'text');
        $('#form-update-points input[name="points-value"]').removeAttr('step');
      }else{
        // Integer
        $('#form-update-points p.help-block[for="points-value"]').html("Value must be an <b>integer</b>");
        $('#form-update-points input[name="points-value"]').attr('type', 'number');
        $('#form-update-points input[name="points-value"]').attr('step', '1');
      }
    }else{
      $("#form-conditional-update-points").addClass('hidden');
    }
  }
}
 
// Initialize/reload the delete object form
function loadDeleteObjectForms(){
  // Clear the object id option
  $('#form-delete-object select[name="object-id"] option').remove();
  // Populate the object id option
  if ( network.hasOwnProperty("objects") ) {
    for ( var object_id in network.objects ){
      $('#form-delete-object select[name="object-id"]').append('<option value="'+object_id+'">'+object_id+'</option>');
    }
  }
  
  // Set warning message
  var selected_object_id = $( "option:selected", $('#form-delete-object select[name="object-id"]') ).val();
  var object = network_id+'.'+selected_object_id;
  var message = $("<p>Do you want to delete "+object+"?</p>\
  <p>All associated streams and points will also be deleted.</p>\
  <p>This action cannot be undone.</p>");
  $("#modal-body-delete-object").html( message );
}

// Initialize/reload the delete stream form
function loadDeleteStreamsForms(){
  // Clear the object id and stream id options
  $('#form-delete-stream select[name="object-id"] option').remove();
  $('#form-delete-stream select[name="stream-id"] option').remove();
  
  if ( network.hasOwnProperty("objects") ) {
    // Populate the object id option
    for ( var object_id in network.objects ){
      $('#form-delete-stream select[name="object-id"]').append('<option value="'+object_id+'">'+object_id+'</option>');
    }
    
    var selected_object_id = $( "option:selected", $('#form-delete-stream select[name="object-id"]') ).val();
    if( selected_object_id in network.objects && 
        network.objects[selected_object_id].hasOwnProperty("streams") && 
        Object.keys( network.objects[selected_object_id].streams ).length > 0 ) {
      
      // Show stream portion of form
      $("#form-conditional-delete-stream").removeClass('hidden');
      
      // Populate the stream id option
      for ( var stream_id in network.objects[selected_object_id].streams ){
        $('#form-delete-stream select[name="stream-id"]').append('<option value="'+stream_id+'">'+stream_id+'</option>');
      }
      
      // Set warning message
      var selected_stream_id = $( "option:selected", $('#form-delete-stream select[name="stream-id"]') ).val();
      var stream = network_id+'.'+selected_object_id+"."+selected_stream_id;
      var message = $("<p>Do you want to delete "+stream+"?</p>\
      <p>All associated points will also be deleted.</p>\
      <p>This action cannot be undone.</p>");
      $("#modal-body-delete-stream").html( message );
    }else{
      $("#form-conditional-delete-stream").addClass('hidden');
    }
  }
}

function loadViewSideBarNav(){
  
  var sidebar_view_objects_link = $('a#sidebar-view');
  sidebar_view_objects_link.html(' View');
  // Remove existing list, if necessary
  $('#sidebar\\:view\\:'+network_id+'\\:objects').remove(); 
  
  // For each "object" in the "network"
  if ( network.hasOwnProperty("objects") && Object.keys( network.objects ).length > 0 ) {
    sidebar_view_objects_link.html('<i class="fa fa-sitemap fa-fw"></i>  View<span class="fa arrow"></span>');
    var sidebar_view_object_list = $('<ul class="nav nav-second-level" id="sidebar:view:'+network_id+':objects"></ul><!-- /.nav-second-level -->');
    sidebar_view_objects_link.after( sidebar_view_object_list );
    
    for ( var object_id in network.objects ){
      //console.log( object_id );
      if ( network.objects.hasOwnProperty(object_id) ) {
        var object_name = network.objects[object_id]['object-details']['object-name'];
        var sidebar_view_object_link;
        // For each "stream" in the "object"
        if ( network.objects[object_id].hasOwnProperty("streams") && Object.keys( network.objects[object_id].streams ).length > 0 ) {
          sidebar_view_object_link = $( '<li><a href="#" id="sidebar:view:'+network_id+':'+object_id+'"><i class="fa fa-sitemap fa-fw"></i> '+object_name+' <br><small>'+object_id+'<small><span class="fa arrow"></span></a></li>' );
          var sidebar_view_stream_list = $('<ul class="nav nav-third-level" id="sidebar:view:'+object_id+':streams"></ul><!-- /.nav-third-level -->');
          for ( var stream_id in network.objects[object_id].streams ){
            //console.log( stream_id );
            if ( network.objects[object_id].streams.hasOwnProperty(stream_id) ) {
              var stream_name = network.objects[object_id].streams[stream_id]['stream-details']['stream-name'];
              sidebar_view_stream_list.append( '<li><a href="#" id="sidebar:view:'+network_id+':'+object_id+':'+stream_id+'"><i class="fa fa-line-chart fa-fw"></i> '+stream_name+' <br><small>'+stream_id+'</small></a></li>' );
            }
          }
          sidebar_view_object_link.append( sidebar_view_stream_list );
        }else{
          sidebar_view_object_link = $( '<li><a href="#" id="sidebar:view:'+network_id+':'+object_id+'"><i class="fa fa-sitemap fa-fw"></i> '+object_name+' <br><small>'+object_id+'</small></a></li>' );
        }
        sidebar_view_object_list.append( sidebar_view_object_link );
      }
    }
    
    // Add functionality to the sidebar
    $('a', sidebar_view_object_list).click(function(e) {
      // Prevent browser from opening link
      e.preventDefault();
      // Select current element
      var $this = $(this);
      var id = $this.attr('id');
      var id_array = id.split(':');
      var select = id_array[1];
      
      if( id_array.length == 4 ){
        var object_id = id_array[3];
        $('form#form-view-object input[name="object-id"]').attr( 'value', object_id );
        
        $("div.page-view-network").addClass('hidden');
        $("div.page-view-stream").addClass('hidden');
        $("div.page-view-object").removeClass('hidden');
        
        $("div.page-view-object .object-name span").text( network.objects[object_id]['object-details']['object-name'] );
        $("div.page-view-object .object-id span").text( object_id );
        if ( network.objects[object_id].hasOwnProperty("streams") ) {
          $("div.page-view-object .object-streams span").text( Object.keys( network.objects[object_id].streams ).length );
        }
        else{
          $("div.page-view-object .object-streams span").text( 0 );
        }
        
      }else if( id_array.length == 5 ){
        var object_id = id_array[3];
        var stream_id = id_array[4];
        $('form#form-view-stream input[name="object-id"]').attr( 'value', object_id );
        $('form#form-view-stream input[name="stream-id"]').attr( 'value', stream_id );
        $('form#form-view-points input[name="object-id"]').attr( 'value', object_id );
        $('form#form-view-points input[name="stream-id"]').attr( 'value', stream_id );
        
        $("div.page-view-network").addClass('hidden');
        $("div.page-view-object").addClass('hidden');
        $("div.page-view-stream").removeClass('hidden');
        
        $("div.page-view-stream .stream-name span").text( network.objects[object_id].streams[stream_id]['stream-details']['stream-name'] );
        $("div.page-view-stream .stream-id span").text( stream_id );
        $("div.page-view-stream .stream-type span").text( network.objects[object_id].streams[stream_id]['stream-details']['stream-type'] );
        
        if( !network.objects[object_id].streams[stream_id].hasOwnProperty("points") || 
            network.objects[object_id].streams[stream_id].points.length == 0 ) {
          
          $('.page-view-stream.points-table').addClass('hidden');
          $('.page-view-stream.points-plot').addClass('hidden');
        }
        else if( network.objects[object_id].streams[stream_id]['points-details']['points-type'] == 'i' ||
            network.objects[object_id].streams[stream_id]['points-details']['points-type'] == 'f' ){
            
          reloadPointsPlot( network_id, object_id, stream_id );
          
          $('.page-view-stream.points-table').addClass('hidden');
          $('.page-view-stream.points-plot').removeClass('hidden');
        }
        else{
        
          reloadPointsTable( network_id, object_id, stream_id );
          
          $('.page-view-stream.points-plot').addClass('hidden');
          $('.page-view-stream.points-table').removeClass('hidden');
        }
      }
      
      // Remove the class 'active' from all elements
      $('#dashboard-sidebar-nav a.active').removeClass('active');
      // Add the class 'active' to current element
      $this.addClass('active');
      
      // Hide/Show pages
      $('div#wrapper div.page').addClass('hidden');
      $('div#wrapper div#page-view').removeClass('hidden');
      
      // Remove any alerts, if applicable
      $('.alert', $('div#wrapper div#page-'+select)).remove();
      
      /*
      // Remove the class 'active' from all elements
      $('#dashboard-sidebar-nav a.active').removeClass('active');
      // Add the class 'active' to current element
      $this.addClass('active');
      
      // Hide/Show pages
      $('div#wrapper div.page').addClass('hidden');
      $('div#wrapper div#page-'+select).removeClass('hidden');
      
      // Remove any alerts, if applicable
      $('.alert', $('div#wrapper div#page-'+select)).remove();
      
      // Load the relevant forms
      if( select == 'create' ){
        loadCreateStreamForms();
      }
      else if( select == 'update' ){
        loadUpdateObjectForms();
        loadUpdateStreamsForms();
        loadUpdatePointsForms();
      }
      else if( select == 'delete' ){
        loadDeleteObjectForms();
        loadDeleteStreamsForms();
      }
      */
    });
  }
  
  // Load/reload Metis Menu plugin
  $('#side-menu').metisMenu();

}





//
//  Function for loading a plot
//
function loadPointsPlot(){
  // Create plot container
  var streamPlot = $('#page-view-points-plot');
  
  var timezone = '';
  try{
    timezone = /\((.*)\)/.exec(new Date().toString())[1];
    timezone = ' ('+timezone+')';
  }catch(err){
    // Do nothing
  }
  
  // Load Highcharts
  streamPlot.highcharts({
    chart: {
        type: 'spline',
        zoomType: 'x'
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
        },
        title: {
            text: 'Date'+timezone
        }
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: true
            }
        }
    }
  });
}

//
//  Function reloading the points plot
//
function reloadPointsPlot( network_id, object_id, stream_id ){
  var points = network.objects[object_id].streams[stream_id].points
  // Iterate over points to place in Highcharts format
  var datapoints = [];
  for ( var i = 0; i < points.length; i++){
    var at_date = new Date(points[i].at);
    var at = at_date.getTime() - at_date.getTimezoneOffset()*60*1000;
    datapoints.unshift( [ at, points[i].value] );
  }
  
  // Update Highcharts plot
  var streamPlot = $('#page-view-points-plot');
  if( streamPlot.highcharts().series.length > 0 ){
    streamPlot.highcharts().series[0].setData( datapoints );
  }else{
    streamPlot.highcharts().addSeries({
      name: stream_id,
      data: datapoints
    });
  }
}

//
//  Function reloading the points table
//  by retrieving most recent data from WCC server. 
//
function reloadPointsTable( network_id, object_id, stream_id ){
  var tbody = $('div#page-view-points-table tbody')
  tbody.html('');
  
  var points = network.objects[object_id].streams[stream_id].points
  // Iterate over points to populate the table.
  for ( var i = 0; i < points.length; i++){
    tbody.append(
      '<tr><td>'+points[i].value+'</td>'+
      '<td>'+points[i].at+'</td>'+
      '<td>'+(new Date(points[i].at)).toLocaleString()+'</td></tr>'
    );
  }
}

/*
//
//  Function for URL query parameters
//
function getUrlQueryParams(){
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
}

//window.location.href

location.href.replace( 

*/

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}