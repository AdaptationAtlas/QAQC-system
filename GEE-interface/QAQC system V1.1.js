// Optimized script for the QAQC app
// Adaptation atlas QAQC app

// Create maps
var singleMap = ui.root.widgets().get(0);
var map0 = ui.Map();
var map1 = ui.Map().setControlVisibility({all:false, zoomControl:true, layerList:true});
var map2 = ui.Map().setControlVisibility({all:false, layerList:true});
var map3 = ui.Map().setControlVisibility({all:false, layerList:true});
var map4 = ui.Map().setControlVisibility({all:false,  layerList:true});
var map5 = ui.Map().setControlVisibility({all:false, zoomControl:true, layerList:true});
var map6 = ui.Map().setControlVisibility({all:false, layerList:true});


// link all maps
var linker = ui.Map.Linker([map0, map1, map2, map3, map4, map5, map6]);
// creat map list
var maps = [map0,map1,map2,map3,map4,map5,map6];

//set initial location
map0.setCenter(18.5,5.15,4);

// clear the canvas
ui.root.clear();

// change the cursor for a crosshair in all the maps
linker.forEach(function(map){map.style().set('cursor', 'crosshair')});

// side panel
var side_panel = ui.Panel({layout: ui.Panel.Layout.flow('vertical'),
      style: {height: '100%', width: '15%'}});
var subset_pan= ui.Panel({style: {height: '100%', width: '15%'}});
// initial sidebar + map
var splitPanel = ui.SplitPanel({firstPanel:map0, 
secondPanel: subset_pan,
  orientation: 'horizontal',
  style:{stretch: 'both'}
});




ui.root.widgets().reset([side_panel, splitPanel]);

// Create a grid of 4 maps.
var mapGrid = ui.Panel(
    [
      ui.Panel([map1, map2], null, {stretch: 'both'}),
      ui.Panel([map3, map4], null, {stretch: 'both'})
    ],
    ui.Panel.Layout.Flow('horizontal'), {stretch: 'both'});
    
// create 4 panel view
var splitPanel4 = ui.SplitPanel({firstPanel: side_panel, 
secondPanel: mapGrid,
  orientation: 'horizontal',
  style:{stretch: 'both'}
});


///////////// helper functions ///////////
// function to remove selection button
 function rem_sel(map_pan){
      var sel= maps[map_pan].widgets().get(1);
      if (sel){maps[map_pan].remove(sel)}
      else{print('Button not found')}
    }

// functions to remove sliders
  function rem_sl(map_pan){
      var slid= maps[map_pan].widgets().get(2);
      if (slid){maps[map_pan].remove(slid)}
      else{print('Slider not found')}
    }
    
  // function to remove legend
  var legend;
  function rem_leg(map_pan){
      legend = maps[map_pan].widgets().get(2);
      if(legend){
              maps[map_pan].remove(legend);
              }
        }
  
var addfirst =  function addlay (map_panel){
          var ini_im = ee.Image('projects/practical-truck-289821/assets/CDD');
          var laymin = 0;
          var laymax = 4;
    
      layerSelect0.setDisabled(false); 
      map_panel.addLayer(ini_im, {min: laymin,max:laymax,  palette: pal}, 'CDD');

      // add slider
      var step = (laymax-laymin)/10;
      var slabel0 = ui.Label('Select a Layer to Mask');

      var spanel1 = ui.Panel({
        widgets: [slabel0],
        layout: ui.Panel.Layout.flow('vertical'),
        style: {position: 'bottom-right', padding:0}
    });
      map_panel.add(spanel1);
      
      // add dynamic legend
      function makeLegend (colors) {
        var lon = ee.Image.pixelLonLat().select('longitude');
        var gradient = lon.multiply((colors.max-colors.min)/100.0).add(colors.min);
        var legendImage = gradient.visualize(colors);
        
        var thumb = ui.Thumbnail({
          image: legendImage, 
        params: {bbox:'0,0,100,8', dimensions:'100x20'},  
        style: {position: 'bottom-center', margin: '0px 8px ', padding: 0}
      });
      var panel2 = ui.Panel({
        widgets: [
          ui.Label(laymin.toFixed(1), {fontSize: '12px'}),
          ui.Label({style: {stretch: 'horizontal'}}), 
          ui.Label(laymax.toFixed(1), {fontSize: '12px', padding:0})
        ],
        layout: ui.Panel.Layout.flow('horizontal', true),
        style: {stretch: 'horizontal', maxWidth: '270px', margin: '0px',padding: '0px 0px 0px 0px'}
      });
      
      return ui.Panel({style:{position:'bottom-left'}}).add(panel2).add(thumb);
      
      }
      legend = makeLegend(colors);
      map_panel.add(legend);
      
      }

// function to add layer
function addlay0(panel){
    print('addlay0 activated for map:', panel)
    maps[panel].layers().reset();
    rem_sl(panel);
    rem_leg(panel);
    print(selector_list)
    var selector = selector_list[panel];
    var imageId = selector.getValue();
    print(imageId)
    var image;
    //print(vismin)
    var vismax;
        if (imageId) {
      // If an image id is found, create an image.
      image = ee.Image(imageId);
      print(image)
      image = image.where(image.lte(-1000),-1);
      lay = image.clip(AF);
      //print('lay after add0',lay);
      // Add the image to the map with the corresponding visualization options.
      //var visOption = app.VIS_OPTIONS[app.vis.select.getValue()];
      var clip = image.clip(geom);
      var minMax = clip.select(0).reduceRegion({reducer: ee.Reducer.minMax(), 
                                  geometry:geom, 
                                  scale: clip.projection().nominalScale(),
                                  bestEffort: true,
                                  maxPixels: 10e15});
      var keyval = minMax.rename(minMax.keys(), ['lmax','lmin']);
      //print(keyval)
      keyval.evaluate(function(ext){
      vismin = ext.lmin;
      //print('min', vismin);
      vismax = ext.lmax;
      //print('max', vismax);
      maps[panel].addLayer(clip.select(0), {min: vismin, max: vismax, palette: pal}, c_name + ' '+ imageId);
      maps[panel].addLayer(adm0, {}, 'Country Boundaries', false);
      });
      maps[panel].centerObject(geom);
      image = ee.Image(imageId);
      print(image)
      image = image.where(image.lte(-1000),-1);
      // // Calculate min/max values
    var minMax1 = image.select(0).reduceRegion({reducer: ee.Reducer.minMax(), 
                                  geometry:geom, 
                                  scale: lay.projection().nominalScale(),
                                  bestEffort: true,
                                  maxPixels: 10e15});
// Rename keys
    var minMaxkeys1 = minMax1.rename(minMax1.keys(), ['lmax','lmin']);
// Retrieve dictionary values and pass to visParam settings

    var laymin;
    var laymax;
    minMaxkeys1.evaluate(function(val){
      laymin = val.lmin;
      //print('min in', laymin)
      laymax = val.lmax;
      //print('max in', laymax)
      var step = (laymax-laymin)/10;
      var slabel0 = ui.Label('Mask layer');
      var slider0 = ui.Slider({
      min: laymin,
      max: laymax,
      value : laymax,
      step: step,
      style: {stretch: 'horizontal', width:'180px', fontSize: '12px'},
      onChange: updateLayer,
      disabled: false
      });
      var slider01 = ui.Slider({
      min: laymin,
      max: laymax,
      value : laymin,
      step: step,
      style: {stretch: 'horizontal', width:'180px', fontSize: '12px'},
      onChange: updateLayer,
      disabled: false
      });
         spanel0 = ui.Panel({
      widgets: [slabel0, slider0, slider01],
      layout: ui.Panel.Layout.flow('vertical'),
      style: {position: 'bottom-right', padding:0
          }
    });
      // Add the panel to the map.
      maps[panel].add(spanel0);
   //print(maps[0].widgets());
   

   // add dynamic legend
    function makeLegend (colors) {
      var lon = ee.Image.pixelLonLat().select('longitude');
      var gradient = lon.multiply((colors.max-colors.min)/100.0).add(colors.min);
      var legendImage = gradient.visualize(colors);
      
      var thumb = ui.Thumbnail({
        image: legendImage, 
      params: {bbox:'0,0,100,8', dimensions:'100x20'},  
      style: {position: 'bottom-center', margin: '0px 8px ', padding: 0}
    });
    var panel2 = ui.Panel({
      widgets: [
        ui.Label(laymin.toFixed(1), {fontSize: '12px'}),
        ui.Label({style: {stretch: 'horizontal'}}), 
        ui.Label(laymax.toFixed(1), {fontSize: '12px', padding:0})
      ],
      layout: ui.Panel.Layout.flow('horizontal', true),
      style: {stretch: 'horizontal', maxWidth: '270px', margin: '0px',padding: '0px 0px 0px 0px'}
    });
    
    return ui.Panel({style:{position:'bottom-left'}}).add(panel2).add(thumb);
    
    }
    legend = makeLegend(colors);
    maps[panel].add(legend);
      
  // Slider function
    function updateLayer(){
  //rem_sl();
  lname = maps[panel].layers().get(0).getName();
  //print('lname in',lname)
  maps[panel].layers().reset();
  var maskvalue = slider0.getValue();
  var minval = slider01.getValue();
  var singleband= clip.select(0);
  var result = singleband.updateMask(singleband.lte(maskvalue).and(singleband.gte(minval)));
  maps[panel].addLayer(result, {min: laymin,max:laymax,  palette: pal}, lname);
  
}
  });
    }
        else(print('error'))
  //////////////////////////////// slider ///////////////////////////////////////////////////
    
     


country_select.setDisabled(false);
calc_area.setDisabled(false);
stats_button.setDisabled(false);
checkbox.setDisabled(false);
checkbox1.setDisabled(false);
    
}

// legend palette
  // var pal = [
  //   "#000080","#0000D9","#4000FF","#8000FF","#0080FF","#00FFFF",
  //   "#00FF80","#80FF00","#DAFF00","#FFFF00","#FFF500","#FFDA00",
  //   "#FFB000","#FFA400","#FF4F00","#FF2500","#FF0A00","#FF00FF",
  // ];
  var pal = ['#000000','#E15048', '#FEB24C', '#FEEDA0', '#91CF60'];
  var colors = {min: -10 , max : 10, palette: pal};
//////////////////////////////// Create layer selection dropdown list /////////////////////////////////////
//var ImgCollection  = ee.ImageCollection("ECMWF/ERA5/MONTHLY").sort('system:index', false);
var ImgCollection  = ee.ImageCollection("projects/adaptation-atlas-project/assets/results_mean_class_crop");
//print(ImgCollection.limit(10))
//var COLLECTION_ID = 'ECMWF/ERA5/MONTHLY';
//temporary visualization params
var vis = {
  //bands: ['mean_2m_air_temperature'],
  min: 274,
  max: 318,
  palette: pal
};

//variables for first layer on each map
var lay;
var lay1;
var lay2;
var lay3;
var lay4;
var lay5;
var lay6;


var imgs = ImgCollection;

// function to get images from collection to list
function getIds(collection) {
  var info = collection.getInfo(); // turns the collection to a local list
  var images = info['features']; // need to use local javascript to access
  var ids = [];
  for (var i=0; i<images.length; i++) {  // note .length not size()
    var im = images[i];                   // [i] not .get(i)
    var id = im['id']
    ids.push(id);                    // note .push() not .cat()
  }
  return ids;
  }

// list of images in the collection
//var layerlist = getIds(imgs);
var lname;
var spanel0;
// function to add selected layer to the map

var vismin;
var vismax;



// dropdown buttons for each map
var layerSelect0 = ui.Select({style:{position: 'top-left', 
                                fontSize: '20px'}});
var layerSelect1 = ui.Select({style:{position: 'top-left', 
                                fontSize: '20px'}});
var layerSelect2 = ui.Select({style:{position: 'top-left', 
                                fontSize: '20px'}});
var layerSelect3 = ui.Select({style:{position: 'top-left', 
                                fontSize: '20px'}});
var layerSelect4 = ui.Select({style:{position: 'top-left', 
                                fontSize: '20px'}});
var layerSelect5 = ui.Select({style:{position: 'top-left', 
                                fontSize: '20px'}});
var layerSelect6 = ui.Select({style:{position: 'top-left', 
                                fontSize: '20px'}});
var selector_list = []
var Collections = ['projects/adaptation-atlas-project/assets/results_mean_class_crop',
                   'projects/adaptation-atlas-project/assets/Test',
                   'projects/adaptation-atlas-project/assets/masks'];
var colSelect = ui.Select({items:Collections, 
                              onChange: col_select,
                              placeholder: 'Select Collection',
                              });
function col_select(){
      rem_sl(0);
      rem_leg(0);
      rem_sel(0);
      rem_sl(1);
      rem_leg(1);
      rem_sel(1);
      rem_sl(2);
      rem_leg(2);
      rem_sel(2);
      rem_sl(3);
      rem_leg(3);
      rem_sel(3);
      rem_sl(4);
      rem_leg(4);
      rem_sel(4);
      rem_sl(5);
      rem_leg(5);
      rem_sel(5);
      rem_sl(6);
      rem_leg(6);
      rem_sel(6);
      
     
      var colname= colSelect.getValue();
      var imgs = ee.ImageCollection(colname);
    
      // list of images in the collection
      var layerlist = getIds(imgs);
     
     layerSelect0 = ui.Select({items:layerlist, 
                                  onChange: function () {
                                    addlay0(0);
                                  },
                                  placeholder: 'Select layer to load',
                                  style:{position: 'top-left', 
                                    fontSize: '20px'}});
     layerSelect1 = ui.Select({items:layerlist, 
                                  onChange: function () {
                                    addlay0(1);
                                  },
                                  placeholder: "Select layer to load",
                                  style:{position: 'top-left', 
                                    fontSize: '20px'}});
     layerSelect2 = ui.Select({items:layerlist, 
                                  onChange: function () {
                                    addlay0(2);
                                  },
                                  placeholder: "Select layer to load",
                                  style:{position: 'top-left', 
                                    fontSize: '20px'}});
     layerSelect3 = ui.Select({items:layerlist, 
                                  onChange: function () {
                                    addlay0(3);
                                  },
                                  placeholder: "Select layer to load",
                                  style:{position: 'top-left', 
                                    fontSize: '20px'}});
     layerSelect4 = ui.Select({items:layerlist, 
                                  onChange: function () {
                                    addlay0(4);
                                  },
                                  placeholder: "Select layer to load",
                                  style:{position: 'top-left', 
                                    fontSize: '20px'}});
     layerSelect5 = ui.Select({items:layerlist, 
                                  onChange: function () {
                                    addlay0(5);
                                  },
                                  placeholder: "Select layer to load",
                                  style:{position: 'top-left', 
                                    fontSize: '20px'}});
     layerSelect6 = ui.Select({items:layerlist, 
                                  onChange: function () {
                                    addlay0(6);
                                  },
                                  placeholder: "Select layer to load",
                                  style:{position: 'top-left', 
                                    fontSize: '20px'}});
     selector_list = [layerSelect0, layerSelect1, layerSelect6, 
                      layerSelect3, layerSelect4, layerSelect5, layerSelect6]
      maps[0].add(layerSelect0);
      maps[1].add(layerSelect1);
      maps[2].add(layerSelect2);
      maps[3].add(layerSelect3);
      maps[4].add(layerSelect4);
      maps[5].add(layerSelect5);
      maps[6].add(layerSelect6);
     
     linker.forEach (function clean(map){
          map.layers().reset();
        });
      
     linker.forEach (addfirst);

      
       // get initial layers
      function get_imgs(){
              lay =  maps[0].layers().get(0).getEeObject();
              lay1 = maps[1].layers().get(0).getEeObject();
              lay2 = maps[2].layers().get(0).getEeObject();
              lay3 = maps[3].layers().get(0).getEeObject();
              lay4 = maps[4].layers().get(0).getEeObject();
              lay5 = maps[5].layers().get(0).getEeObject();
              lay6 = maps[6].layers().get(0).getEeObject();
            }
      get_imgs();
}

/////////////////////////////// create checkbox 4 panel view////////////////////////////////////////////////// 
var checkbox = ui.Checkbox({label:'4 panels', value: false, disabled: true});

// checkbox callback
checkbox.onChange(function(checked) {
  if (checked) {
    checkbox1.setValue(false,false);
    ui.root.widgets().reset([side_panel, mapGrid]);
    stats_button.setDisabled(true);
    stats_pan.clear();
    side_panel.remove(diff_button);
    side_panel.remove(diff_lab);
  } else {
    ui.root.widgets().reset([side_panel, splitPanel]);
    stats_button.setDisabled(false);
    side_panel.remove(diff_button);
    side_panel.remove(diff_lab);
    //print('checkbox1 Un map0 widg',maps[0].widgets());
    }
});


// Create a grid of 2 maps.
var mapGrid2 = ui.Panel([ui.Panel(map5, null, {stretch:'both'}),
ui.Panel(map6, null, {stretch:'both'})], 
ui.Panel.Layout.Flow('horizontal'), {stretch:'both'});

//////////////////////////////////////////////// second split panel check box////////////////////////////////
var checkbox1 = ui.Checkbox({label:'2 panels', value: false, disabled: true});

// checkbox1 callback
checkbox1.onChange(function(checked) {
  if (checked) {
    checkbox.setValue(false,false);
    ui.root.widgets().reset([side_panel, mapGrid2]);
    stats_button.setDisabled(true);
    stats_pan.clear();
    side_panel.add(diff_lab);
    side_panel.add(diff_exp);
    side_panel.add(diff_button);
  } else {
    ui.root.widgets().reset([side_panel, splitPanel]);
    stats_button.setDisabled(false);
    side_panel.remove(diff_button);
    side_panel.remove(diff_lab);
    side_panel.remove(diff_exp);
  }
});

// Configure maps
// var cgiar = ee.Image('projects/practical-truck-289821/assets/CDD')
var adm0 = ee.FeatureCollection("FAO/GAUL/2015/level0");

// vis params country boundaries layer
var styleParams = {
  fillColor: '#ffffff00',
  color: 'black',
  width: 1.0,
};
adm0 = adm0.style(styleParams);

// Add a title and some explanatory text to a side panel.
var header = ui.Label('Adaptation Atlas QAQC System', {fontSize: '28px', color: '#15a79f'});
var text = ui.Label(
    'Visualization tool to perform quality assurance and ' +
    'quality control on the Agriculture Adaptation Atlas datasets',
    {fontSize: '11px'});

///////////////////// function to get coordinates on click and query layer values/////////////////////////////

// panels to hold lon/lat values
var lon = ui.Label();
var lat = ui.Label();

// create panels to display layer values 
var infopanel = ui.Panel();
var infopanel0 = ui.Panel();
var infopanel1 = ui.Panel();
var infopanel2 = ui.Panel();
var infopanel3 = ui.Panel();
var infopanel4 = ui.Panel();
var infopanel5 = ui.Panel();
var infopanel6 = ui.Panel();

// add cords to panel
infopanel.add(ui.Panel([ui.Label('coords: '),lon, lat], ui.Panel.Layout.flow('horizontal')));

//infopanel.style().set({border: '2px solid darkgray'})



// Create inspector panels
var inspector0 = ui.Panel().add(ui.Label('Click map to get value', {fontSize: '10px'}));
var inspector1 = ui.Panel().add(ui.Label('Click map to get value', {fontSize: '10px'}));
var inspector2 = ui.Panel().add(ui.Label('Click map to get value', {fontSize: '10px'}));
var inspector3 = ui.Panel().add(ui.Label('Click map to get value', {fontSize: '10px'}));
var inspector4 = ui.Panel().add(ui.Label('Click map to get value', {fontSize: '10px'}));
var inspector5 = ui.Panel().add(ui.Label('Click map to get value', {fontSize: '10px'}));
var inspector6 = ui.Panel().add(ui.Label('Click map to get value', {fontSize: '10px'}));


//set inspector panel style for all the maps
inspector0.style().set({padding: '0px' ,maxHeight:'30px',position: 'bottom-center'});
inspector1.style().set({padding: '0px' ,maxHeight:'30px',position: 'bottom-center'});
inspector2.style().set({padding: '0px' ,maxHeight:'30px',position: 'bottom-center'});
inspector3.style().set({padding: '0px' ,maxHeight:'30px',position: 'bottom-center'});
inspector4.style().set({padding: '0px' ,maxHeight:'30px',position: 'bottom-center'});
inspector5.style().set({padding: '0px' ,maxHeight:'30px',position: 'bottom-center'});
inspector6.style().set({padding: '0px' ,maxHeight:'30px',position: 'bottom-center'});

//////////////////////// function to get map coordinates and values in all the maps////////////////////////////
linker.forEach(function(map){map.onClick(function(coords) {
  // Update the lon/lat panel with values from the click event.
  lon.setValue('lon: ' + coords.lon.toFixed(2)),
  lat.setValue('lat: ' + coords.lat.toFixed(2));
  
  var point = ee.Geometry.Point(coords.lon, coords.lat);
  
  inspector0.clear();
  inspector1.clear();
  inspector2.clear();
  inspector3.clear();
  inspector4.clear();
  inspector5.clear();
  inspector6.clear();

  inspector0.add(ui.Label('loading...', {fontSize: '10px'}));
  inspector1.add(ui.Label('loading...', {fontSize: '10px'}));
  inspector2.add(ui.Label('loading...', {fontSize: '10px'}));
  inspector3.add(ui.Label('loading...', {fontSize: '10px'}));
  inspector4.add(ui.Label('loading...', {fontSize: '10px'}));
  inspector5.add(ui.Label('loading...', {fontSize: '10px'}));
  inspector6.add(ui.Label('loading...', {fontSize: '10px'}));
  
  var layer0 = maps[0].layers().get(0).getEeObject();
      layer0 = layer0.select(0).rename('b1');
  var imgValue = layer0.reduceRegion(ee.Reducer.first(), point, 10).evaluate(function(val){
    var test=  val.b1 !== null;
    if(test){
    var val0 = maps[0].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    val0 = maps[0].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    inspector0.clear();
    inspector0.add(ui.Label(val0, {fontSize: '10px'}));
  }
    else{
    inspector0.clear();
    inspector0.add(ui.Label('No Data', {fontSize: '10px'}));}
    });
  var layer1 = maps[1].layers().get(0).getEeObject();
      layer1 = layer1.select(0).rename('b1');
  var imgValue1 = layer1.reduceRegion(ee.Reducer.first(), point, 10).evaluate(function(val){
    var test=  val.b1 !== null;
    if(test){
    var val0 = maps[2].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    val0 = maps[2].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    inspector1.clear();
    inspector1.add(ui.Label(val0, {fontSize: '10px'}));
  }
    else{
    inspector1.clear();
    inspector1.add(ui.Label('No Data', {fontSize: '10px'}));}
    });
  var layer2 = maps[2].layers().get(0).getEeObject();
      layer2 = layer2.select(0).rename('b1');
  var imgValue2 = layer2.reduceRegion(ee.Reducer.first(), point, 10).evaluate(function(val){
    var test=  val.b1 !== null;
    if(test){
    var val0 = maps[2].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    val0 = maps[2].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    inspector2.clear();
    inspector2.add(ui.Label(val0, {fontSize: '10px'}));
  }
    else{
    inspector2.clear();
    inspector2.add(ui.Label('No Data', {fontSize: '10px'}));}
    });
  var layer3 = maps[3].layers().get(0).getEeObject();
      layer3 = layer3.select(0).rename('b1');
  var imgValue3 = layer3.reduceRegion(ee.Reducer.first(), point, 10).evaluate(function(val){
    var test=  val.b1 !== null;
    if(test){
    var val0 = maps[3].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    val0 = maps[3].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    inspector3.clear();
    inspector3.add(ui.Label(val0, {fontSize: '10px'}));
  }
    else{
    inspector3.clear();
    inspector3.add(ui.Label('No Data', {fontSize: '10px'}));}
    });
  var layer4 = maps[4].layers().get(0).getEeObject();
      layer4 = layer4.select(0).rename('b1');
  var imgValue4 = layer4.reduceRegion(ee.Reducer.first(), point, 10).evaluate(function(val){
    var test=  val.b1 !== null;
    if(test){
    var val0 = maps[4].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    val0 = maps[4].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    inspector4.clear();
    inspector4.add(ui.Label(val0, {fontSize: '10px'}));
  }
    else{
    inspector4.clear();
    inspector4.add(ui.Label('No Data', {fontSize: '10px'}));}
    });
  var layer5 = maps[5].layers().get(0).getEeObject();
      layer5 = layer5.select(0).rename('b1');
  var imgValue5 = layer5.reduceRegion(ee.Reducer.first(), point, 10).evaluate(function(val){
    var test=  val.b1 !== null;
    if(test){
    var val0 = maps[5].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    val0 = maps[5].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    inspector5.clear();
    inspector5.add(ui.Label(val0, {fontSize: '10px'}));
  }
    else{
    inspector5.clear();
    inspector5.add(ui.Label('No Data', {fontSize: '10px'}));}
    });
  var layer6 = maps[6].layers().get(0).getEeObject();
      layer6 = layer6.select(0).rename('b1');
  var imgValue6 = layer6.reduceRegion(ee.Reducer.first(), point, 10).evaluate(function(val){
    var test=  val.b1 !== null;
    if(test){
    var val0 = maps[6].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    val0 = maps[6].layers().get(0).getName() +': ' + val.b1.toFixed(2);
    inspector6.clear();
    inspector6.add(ui.Label(val0, {fontSize: '10px'}));
  }
    else{
    inspector6.clear();
    inspector6.add(ui.Label('No Data', {fontSize: '10px'}));}
    });
   });
});

///////////////////////////////////////// Function to calculate area ///////////////////////////////////////////////


var adm0f= ee.FeatureCollection("projects/practical-truck-289821/assets/Africa_ADM0").sort('system:index', false);
var AF = 
    ee.Geometry.Polygon(
        [[[-26, 37.5],
          [-26, -35],
          [65.18532093772478, -35],
          [65.18532093772478, 37.5]]], null, false);
          
var adm0f_list =ee.List(adm0f.aggregate_array('NAME_0')).sort();
var adm0f_list = adm0f_list.distinct().getInfo();

// define function global variables 
var nam;
var geom = AF;
var c_name = 'Africa';
var area_chart;

var Adm_sim = adm0f.map(function(feature) {
  return feature.simplify({maxError: 100});
});

function get_area(){
  var note = ui.Label();
  subset_pan.remove(area_chart);
  //subset_pan.remove(note);
  var layer = maps[0].layers().get(0).getEeObject();
  var layer = layer.select(0)
  area_chart = ui.Chart.image.histogram({image:layer, region: geom, scale: 1000,
  maxBuckets: 10, maxPixels: 1e20,
// area_chart = ui.Chart.image.byRegion({image:layer, regions: geom, scale: 500
// .setChartType('ColumnChart')
})
//.setChartType('ColumnChart')
.setOptions({
          title: 'Pixel Histogram for ' + c_name,
          hAxis: {
            title: 'raster values',
            titleTextStyle: {italic: false, bold: true}},
          vAxis: {title: 'Square Km',
           titleTextStyle: {italic: false, bold: true}}
         })
  // Fetch the summed area property from the resulting dictionary and convert
// square meters to square kilometers.
//var squareMeters = area.getNumber('area');
//var squareKilometers = squareMeters.divide(1e6);
  //note = ui.Label('Each pixel represents 1 square Km')
  //subset_pan.add(note);
  subset_pan.add(area_chart);
}


var calc_area = ui.Button({label: 'Count pixels', onClick: get_area, disabled: true});
//country_select.style().set({position: 'top-center'})

//////////////////////////////// layer 0 stats ///////////////////////////////////////////////////////////////

var stats_button = ui.Button({label:'Calculate layer stats',
                              onClick: calc_stats, disabled: true});

// variables to store layer stats
var lmin = ui.Label();
var lmax = ui.Label();
var lmean = ui.Label();
var lmed = ui.Label();
var lstd = ui.Label();
var stats_pan = ui.Panel();
var load = ui.Panel(ui.Label('Loading...'));
//var geom = adm0f.geometry()
function calc_stats(){
 // // remove panel
 side_panel.remove(stats_pan);
 stats_pan.clear();
 stats_button.setLabel('Calculating stats...');
// // Calculate min/max values
var minMax = lay.select(0).reduceRegion({reducer: ee.Reducer.minMax(), 
                              geometry:geom, 
                              scale: lay.projection().nominalScale(),
                              bestEffort: true,
                              maxPixels: 10e15});
//print(minMax);                            
// Rename keys
var minMaxkeys = minMax.rename(minMax.keys(), ['lmax','lmin']);
//print('minMaxkeys', minMaxkeys);
var laymean = lay.select(0).reduceRegion({reducer: ee.Reducer.mean(), 
                              geometry:geom, 
                              scale: lay.projection().nominalScale(),
                              bestEffort: true,
                              maxPixels: 10e15});
var meankeys = laymean.rename(laymean.keys(), ['lmean']);

var laymed = lay.select(0).reduceRegion({reducer: ee.Reducer.median(), 
                              geometry:geom, 
                              scale: lay.projection().nominalScale(),
                              bestEffort: true,
                              maxPixels: 10e15});
var medkeys = laymed.rename(laymed.keys(), ['lmed']);

// Retrieve dictionary values and pass to visParam settings
minMaxkeys.evaluate(function(val){
  lmin.setValue('layer min: '+val.lmin.toFixed(2));
  lmax.setValue('layer max: '+val.lmax.toFixed(2));
  
});
//print('global test', lmin)
meankeys.evaluate(function(val){
  lmean.setValue('layer mean: '+val.lmean.toFixed(2));
  stats_button.setLabel('Calculate layer stats');
});

medkeys.evaluate(function(val){
  lmed.setValue('layer median: '+val.lmed.toFixed(2));
  //(ui.Label('Layer mean: ', lmean))
});

//print(side_panel.widgets())
//side_panel.widgets().add(stats_button)
stats_pan.clear();
stats_pan.add(ui.Label(maps[0].layers().get(0).getName(), {'fontWeight': 'bold'}));
stats_pan.add(lmin);
stats_pan.add(lmax);
stats_pan.add(lmean);
stats_pan.add(lmed);
side_panel.add(stats_pan);
//maps[0].remove(load)
//print(side_panel.widgets())
}



///////////////////////////////////////// function to subset by country////////////////////////////////////
function country_selection (country){


  function country_view (image, x) { 
    var imageId =maps[x].layers().get(0).getName();
    maps[x].layers().reset();
    var vismin;
    var vismax;
    var minMax = image.select(0).reduceRegion({reducer: ee.Reducer.minMax(), 
                                  geometry:geom, 
                                  scale: image.projection().nominalScale(),
                                  bestEffort: true,
                                  maxPixels: 10e15});
    var keyval = minMax.rename(minMax.keys(), ['lmax','lmin']);
      //print(keyval)
    keyval.evaluate(function(ext){
    vismin = ext.lmin;
      //print('min', vismin);
    vismax = ext.lmax;
      //print('max', vismax);
    maps[x].addLayer(image.select(0), {min: vismin, max: vismax, palette: pal}, c_name + ' '+ imageId);
    maps[x].addLayer(adm0, {}, 'Country Boundaries', false);
    });

  }
  subset_pan.remove(area_chart);
  restore_but.setDisabled(false);
  nam = adm0f.filter(ee.Filter.eq('NAME_0', country));
  c_name = nam.first();
  c_name = ee.Feature(c_name);
  c_name = c_name.get('NAME_0').getInfo();
  geom = nam.geometry();
  maps[0].centerObject(nam);
  //lay = maps[0].layers().get(0).getEeObject();
  //print('lay after CS',lay);
  var clipped0 = lay.clip(nam);
  //print('clipped0',clipped0);
  
  country_view(clipped0,0);
  
  
  //lay1 = maps[1].layers().get(0).getEeObject()
  
  var clipped1 = lay1.clip(nam);
  country_view(clipped1,1);

  var clipped2 = lay2.clip(nam);
  country_view(clipped2,2);

  var clipped3 = lay3.clip(nam);
  country_view(clipped3,3);

  var clipped4 = lay4.clip(nam);
  country_view(clipped4,4);
  
  var clipped5 = lay5.clip(nam);
  country_view(clipped5,5);
  
  var clipped6 = lay6.clip(nam);
  country_view(clipped6,6);
  

}


// create dropdown list button
var country_select = ui.Select({
  items: adm0f_list, 
  onChange: country_selection,
  placeholder: 'Select a country',
  style: {width: '150px'},
  disabled: true
}
  );

//////////////////////////////////////////// Restore Africa View//////////////////////////////////////////
function restore(){
    rem_sl(0);
    rem_leg(0);
    linker.forEach (function clean(map){
      map.layers().reset();
    });
    c_name = 'Africa';

    country_select.items().reset(adm0f_list);
    subset_pan.remove(area_chart);
    geom = AF;
    restore_but.setDisabled(true);
    maps[0].centerObject(geom, 4);
    addlay0(0);
    addlay0(1);
    addlay0(2);
    addlay0(3);
    addlay0(4);
    addlay0(5);
    addlay0(6);
  }

var restore_but = ui.Button({label: 'Restore Africa layer view', onClick: restore, disabled: true});

//////////////////////////////////// difference function ///////////////////////////////////////////////////
var diff_button = ui.Button({label: 'Calculate difference', onClick: calc_diff , disabled: false});
var diff_lab = ui.Label('Layer Difference',{fontSize: '20px'});
var diff_exp = ui.Label('Subtracts the image on the right panel '+
                         'to the image on the left panel' ,{fontSize: '10px'});
function calc_diff () {
  rem_sl(5);
  rem_leg(5);
  var img1 = maps[5].layers().get(0).getEeObject();
  var img2 = maps[6].layers().get(0).getEeObject();
  var diff = img1.select(0).subtract(img2.select(0));
  var name1 = maps[5].layers().get(0).getName();
  var name2 = maps[6].layers().get(0).getName();
  
  //print(diff)
  maps[5].layers().reset();
  
  var diffpal= ['white', 'green','yellow','red'];
  
   
    var vismin;
    var vismax;
    var minMax = diff.select(0).reduceRegion({reducer: ee.Reducer.minMax(), 
                                  geometry:geom, 
                                  scale: diff.projection().nominalScale(),
                                  bestEffort: true,
                                  maxPixels: 10e15});
    var keyval = minMax.rename(minMax.keys(), ['lmax','lmin']);
      //print(keyval)
    keyval.evaluate(function(ext){
    vismin = ext.lmin;
      //print('min', vismin);
    vismax = ext.lmax;
      //print('max', vismax);
   maps[5].addLayer(diff,{min:vismin, max: vismax, palette: diffpal},'Difference');
   layerSelect5.setPlaceholder('Difference');
   
   var slabel0 = ui.Label( 'Left panel - right panel', {fontSize: '10px'});

      var spanel1 = ui.Panel({
        widgets: [slabel0],
        layout: ui.Panel.Layout.flow('vertical'),
        style: {position: 'bottom-right', padding:0}
    });
      maps[5].add(spanel1);
      var colors = {min: vismin , max : vismax, palette: diffpal};
      // add dynamic legend
      function makeLegend (colors) {
        var lon = ee.Image.pixelLonLat().select('longitude');
        var gradient = lon.multiply((colors.max-colors.min)/100.0).add(colors.min);
        var legendImage = gradient.visualize(colors);
        
        var thumb = ui.Thumbnail({
          image: legendImage, 
        params: {bbox:'0,0,100,8', dimensions:'100x20'},  
        style: {position: 'bottom-center', margin: '0px 8px ', padding: 0}
      });
      var panel2 = ui.Panel({
        widgets: [
          ui.Label(vismin.toFixed(1), {fontSize: '12px'}),
          ui.Label({style: {stretch: 'horizontal'}}), 
          ui.Label(vismax.toFixed(1), {fontSize: '12px', padding:0})
        ],
        layout: ui.Panel.Layout.flow('horizontal', true),
        style: {stretch: 'horizontal', maxWidth: '270px', margin: '0px',padding: '0px 0px 0px 0px'}
      });
      
      return ui.Panel({style:{position:'bottom-left'}}).add(panel2).add(thumb);
      
      }
      legend = makeLegend(colors);
      maps[5].add(legend);
    
    });

  
  
  diff_button.setDisabled(true);
  
}

// add the header and explanatory text to the side panel
var DescPanel = ui.Panel([header, text], 'flow', {width: '90%'});
// ui.root.widgets().reset([side_panel, singleMap])'


side_panel.add(DescPanel);
side_panel.add(ui.Label('Image Collection', {'font-size': '20px'}));
side_panel.add(colSelect);
side_panel.add(ui.Label('Split panels', {'font-size': '20px'}));
side_panel.add(ui.Panel([checkbox, checkbox1]));
side_panel.add(ui.Label('Layer Information', {'font-size': '20px'}));
side_panel.add(ui.Panel([infopanel, stats_button]));

subset_pan.add(ui.Label('Subset by Country', {'font-size': '20px'}));
subset_pan.add(country_select);
subset_pan.add(restore_but);
subset_pan.add(ui.Label('View raster histogram', {'font-size': '20px'}));
subset_pan.add(calc_area);

//Add the dropdown button to map[0]
maps[0].add(inspector0);
maps[0].add(layerSelect0);

// Empty panels
maps[0].add(ui.Panel({style:{position: 'bottom-left'}}));
maps[0].add(ui.Panel({style:{position: 'bottom-right'}}));
ui.root.widgets().reset([side_panel, mapGrid]);

maps[1].add(inspector1);
maps[2].add(inspector2);
maps[3].add(inspector3);
maps[4].add(inspector4);

maps[3].add(layerSelect3);
maps[4].add(layerSelect4);
maps[1].add(layerSelect1);
maps[2].add(layerSelect2);

maps[1].add(ui.Panel());
maps[2].add(ui.Panel());
maps[3].add(ui.Panel());
maps[4].add(ui.Panel());

ui.root.widgets().reset([side_panel, mapGrid2]);


maps[5].add(inspector5);
maps[6].add(inspector6);
maps[5].add(layerSelect5);
maps[6].add(layerSelect6);

maps[5].add(ui.Panel());
maps[6].add(ui.Panel());

ui.root.widgets().reset([side_panel, splitPanel]);