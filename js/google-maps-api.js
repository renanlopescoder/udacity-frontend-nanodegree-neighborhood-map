/**
 * Udacity Project Neighborhood Map
 * 
 * English:
 *  Project of the course Front End Web Developer Nanodegree by Udacity
 * 
 * Portuguese:
 *  rojeto da formação Desenvolvedor Web Front End pela Udacity
 * 
 */


/**
 * Neighborhood Locations Model
 * Modelo dos Locais do Mapa
 */

  let locations = 
    [
      {
        title : "Serventec", 
        address : "Rua Joaquim Nabuco - Genaro, Dias d'Ávila - BA, 42850-000",
        city : "Dias d'Ávila",
        type : "Industry",
        state : "BA",
        country : "Brazil",
        location : {
          lat : -12.613008,  
          lng : -38.292567
        }
      },
      {
        title : "Hospital Promater", 
        address : "Rua Lauro de Freitas, 1125, Centro - Conjunto Hab., Dias d'Ávila - BA, 42850-000",
        city : "Dias d'Ávila",
        type : "Hospital",
        state : "BA",
        country : "Brazil",
        location : {
          lat : -12.614263, 
          lng : -38.297401
        }
      },
      {
        title : "D'Marco Pizzaria", 
        address : "Av. Pasteur, 202 - Centro, Dias d'Ávila - BA, 42850-000",
        city : "Dias d'Ávila",
        type : "Pizza",
        state : "BA",
        country : "Brazil",
        location : {
          lat : -12.608758, 
          lng : -38.304632
        }
      },
      {
        title : "Centro Educacional Piaget", 
        address : "R. Padre Camilo Torrend, 131 - Centro, Dias d'Ávila - BA, 42850-000",
        city : "Dias d'Ávila",
        type : "School",
        state : "BA",
        country : "Brazil",
        location : {
          lat : -12.609544, 
          lng : -38.303054 
        }
      },
      {
        title : "Macaxeira", 
        address : "R. da Mangueira, 213 - Parque de Dias Davila, Dias d'Ávila - BA, 42850-000",
        city : "Dias d'Ávila",
        type : "Restaurant",
        state : "BA",
        country : "Brazil",
        location : {
          lat : -12.613060, 
          lng : -38.301538
        }
      }
    ];

'use strict';

/**
 * Initializing Controllers
 * Inicializando Controladores da Aplicação
 */

let MapController = {};
let ViewModelController = {};

/**
 * Function to initialize the map
 * Função para inicializar o mapa
 */

function initMap() {
    let map;

    let ddCity = {lat : -12.610013, lng :  -38.302697};

    map = new google.maps.Map (
      document.getElementById('map'), 
      {
        center: ddCity,
        zoom: 13
      }
    );

  /**
   * Function to hide the specific list of markers of the map
   * Função para esconder lista de marcadores do mapa
   * @param {array} markers 
   */

    MapController.hideMarkers = (markers) => {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    };

  /**
   * Function to show the specific list of markers of the map
   * Função para mostrar lista de marcadores do mapa
   * @param {array} markers
   */

    MapController.filterMarkers = (markers) => {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        ViewModelController.markersList.push(markers[i]);
        ViewModelController.setMarkerAnimation(markers[i]);
      }
    };

	  MapController.bounce = function(marker) {
		  MapController.populateInfoWindow(marker, MapController.largeInfoWindow);
	  };

  /**
   * Creating info window
   * Criando janela de informações
  */

    MapController.largeInfoWindow = new google.maps.InfoWindow();

  /**
   * Creating variable to zooming the map to show all the markers
   * Criando uma variável para ampliar o mapa para mostrar todos os marcadores
  */

    MapController.bounds = new google.maps.LatLngBounds();

  /**
   * Function to create markers
   * Função para criar marcadores
   * @param{marker} google.maps.Marker
   * @param{infowindow} google.maps.InfoWindow
   */

    MapController.populateInfoWindow = (marker, infowindow) => {
      if(infowindow.marker != marker) {
        ViewModelController.getWiki(marker.type, (contents) =>{
          infowindow.marker = marker;
          let infoContent = '<div><h6 id="marker-name">' + marker.name + '</h6>' +
                            '<p id="marker-address">' + marker.address + '</p>'+
                            contents;

          infowindow.setContent(infoContent);
          infowindow.open(map, marker);
          ViewModelController.setMarkerAnimation(marker);
        });
      }
    };

  /**
   * Function to create markers
   * Função para criar marcadores
   * @param{array} locations / locais
   */

    MapController.createMarker = (locations) => {       

      /**
       * Loop to iterate in all localizations configuring the marker and push into markers array
       * Loop para iterar sobre as localizações, 
       * configurar o marcador e inserir no array de marcadores
      */

        for (let i = 0; i < locations.length; i++) {
          let position = locations[i].location;
          let name = locations[i].title;
          let address = locations[i].address;
          let type = locations[i].type;

          let marker = new google.maps.Marker({
            'map' : map,
            'position' : position,
            'name' : name,
            'address' : address,
            'animation' : google.maps.Animation.DROP,
            'id' : i,
            'type' : type,
          });
          marker.addListener('click', 
            function() {
              MapController.populateInfoWindow(marker, MapController.largeInfoWindow);
            }
          );
          ViewModelController.markersList.push(marker);
          ViewModelController.markersModel.push(marker);
          MapController.bounds.extend(marker.position);
        };  // End Loop / Fim do Loop
    };

    /**
     * Initiating the map with all markers
     * Inicializando mapa com todos marcadores
     */
    
      MapController.createMarker(locations);

    /**
     * Zooming the map to show all the markers based on markers created
     * Ampliar o mapa para mostrar todos os marcadores com base nos marcadores criados
    */

      map.fitBounds(MapController.bounds);

};


function ViewModel () {

  ViewModelController.markersList = ko.observableArray([]);
  ViewModelController.markersModel  = ko.observableArray([]);
  searchInput = ko.observable();

  /**
   * Function to add animation in the marker
   * Função para adicionar animação no marcador
   * @param{marker} google.maps.Marker
   */

    ViewModelController.setMarkerAnimation = (param) => {
      param.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout( function() { param.setAnimation(null); }, 750);
    };

  ViewModelController.filterMarkers = () => {
    ViewModelController.filteredMarkers = ko.observableArray([]);
    let searchString = searchInput().toLowerCase();
    let len = ViewModelController.markersModel().length;
    for (let i = 0; i < len; i++) {
      let markerName = ViewModelController.markersModel()[i].name.toLowerCase();
      let markerAddress = ViewModelController.markersModel()[i].address.toLowerCase();
      if (markerName.indexOf(searchString) > -1 ||
      markerAddress.indexOf(searchString) > -1 ) {
        ViewModelController.filteredMarkers.push(ViewModelController.markersModel()[i]);
      }
    };
        MapController.hideMarkers(ViewModelController.markersModel());
        ViewModelController.markersList.removeAll();
        MapController.filterMarkers(ViewModelController.filteredMarkers());
        
  };
  
  ViewModelController.getWiki  = (markerType, callback) => {
    var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + markerType + "&format=json&callback=wikiCallback";

    var timeoutWiki = setTimeout(function () {
        alert("Sorry, we failed to get wikipedia articles (Timeout Error) please check your internet connection and try again.");
    }, 8000);

    var contents;
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function (response) {
                articleStr = response[0];
                var url = "http://en.wikipedia.org/wiki/" + articleStr;
                contents = '<li><a href="' + url + '">About: ' + articleStr + '</a></li>';
            callback(contents);
            clearTimeout(timeoutWiki);
        }
    });
}

}

const mapError = () => {
  alert("Error to load the MAP");
};

ko.applyBindings(new ViewModel());






