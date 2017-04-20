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
        title : "D'Marco Pizzaria", 
        address : "Av. Pasteur, 202 - Centro, Dias d'Ávila - BA, 42850-000",
        city : "Dias d'Ávila",
        state : "BA",
        country : "Brazil",
        location : {
          lat : -12.608758, 
          lng : -38.304632
        }
      },
      {
        title : "Tarantella Pizzaria", 
        address : "R. Heitor Dias, 65 - Centro, Dias d'Ávila - BA, 42850-000",
        city : "Dias d'Ávila",
        state : "BA",
        country : "Brazil",
        location : {
          lat : -12.609877,
          lng : -38.304535 
        }
      },
      {
        title : "Macaxeira", 
        address : "R. da Mangueira, 213 - Parque de Dias Davila, Dias d'Ávila - BA, 42850-000",
        city : "Dias d'Ávila",
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
        infowindow.marker = marker;
        let infoContent = '<div><h6 id="marker-name">' + marker.name + '</h6>' +
                          '<p id="marker-address">' + marker.address + '</p>';

        infowindow.setContent(infoContent);
        infowindow.open(map, marker);
        ViewModelController.setMarkerAnimation(marker);
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

          let marker = new google.maps.Marker({
            'map' : map,
            'position' : position,
            'name' : name,
            'address' : address,
            'animation' : google.maps.Animation.DROP,
            'id' : i
          });
          marker.addListener('click', 
            function() {
              MapController.populateInfoWindow(marker, MapController.largeInfoWindow);
            }
          );
          ViewModelController.markersList.push(marker);
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
    let filteredMarkers = ko.observableArray([]);
    let searchString = document.getElementById('search-input').value.toLowerCase();
    let len = locations.length;

    for (let i = 0; i < len; i++) {
      let markerName = locations[i].title.toLowerCase();
      let markerAddress = locations[i].address.toLowerCase();
      if (markerName.indexOf(searchString) > -1 ||
      markerAddress.indexOf(searchString) > -1 ) {
        filteredMarkers.push(locations[i]);
      }
    };
        MapController.hideMarkers(ViewModelController.markersList());
        ViewModelController.markersList.removeAll();
        MapController.createMarker(filteredMarkers());
  };
}

ko.applyBindings(new ViewModel());






