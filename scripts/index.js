/**
 * BpmnJS Editor library
 */

 (function(){
    if (window.BPMN_MODELER_JS_LOADED === true) return;
    window.BPMN_MODELER_JS_LOADED = true;
    var script = document.createElement("script");
    script.id = 'bpmn-modeler-script';
    script.src = "https://unpkg.com/bpmn-js@3.2.0/dist/bpmn-modeler.production.min.js";
    document.head.appendChild(script);

    var style1 = document.createElement('link');
    style1.rel = 'stylesheet';
    style1.href = 'https://unpkg.com/bpmn-js@3.2.0/dist/assets/diagram-js.css';
    document.head.appendChild(style1);

    var style2 = document.createElement('link');
    style2.rel = 'stylesheet';
    style2.href = 'https://unpkg.com/bpmn-js@3.2.0/dist/assets/bpmn-font/css/bpmn.css';
    document.head.appendChild(style2);
  })();

var H5PEditor = H5PEditor || {};

H5PEditor.widgets.bpmnjs = H5PEditor.BpmnJS = (function($) {
  /**
   * Constructor function
   * @param       {object}   parent   Parent representation
   * @param       {object}   field    Field structure representation
   * @param       {mixed}    params   String with stored data or undefined
   * @param       {function} setValue Value storage callback
   * @constructor
   */
  function C(parent, field, params, setValue) {
    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;

    if (params) {
      this.bpmnXML = decodeURIComponent(escape(atob(this.params)));
    } else {
      this.bpmnXML = '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0xqink0" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn:process id="Process_1" isExecutable="false"><bpmn:startEvent id="StartEvent_1" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds x="173" y="102" width="36" height="36" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>';

    }
  }

  C.prototype.initModeler = function($wrapper) {
    var canvasId = 'canvas-' + H5P.createUUID();

    $wrapper.append($('<div>', {
      id: canvasId,
      class: 'h5p-bpmn-js-modeler-canvas'
    }));

    var modeler = this.bpmnModeler = new BpmnJS({
      container: '#' + canvasId,
      keyboard: {
        bindTo: window
      }
    });

    modeler.importXML(this.bpmnXML, function(err) {
      if (err) {
        return console.error('could not import BPMN 2.0 diagram', err);
      }
      // access modeler components
      var canvas = modeler.get('canvas');
      var overlays = modeler.get('overlays');
      // zoom to fit full viewport
      canvas.zoom('fit-viewport');
    });
  };

  /**
   * Builds the DOM objects and appends to the $wrapper
   * Also deals with setup of listeners and event handlers
   * @param  {jQuery} $wrapper DOM node of container element
   * @return {void}
   */
  C.prototype.appendTo = function($wrapper) {
    var _this = this;

    if (window.BpmnJS) {
      this.initModeler($wrapper);
    } else {
      $('#bpmn-modeler-script', document.head).on('load', function() {
        _this.initModeler($wrapper);
      });
    }
  };

  /**
   * Runs before page is saved, makes sure the values are stored.
   * Does not really do any validation.
   * @return {boolean} Always returns true
   */
  C.prototype.validate = function() {
    var _this = this;

    // TODO See if this seemingly asynchronous function is always able to store
    // the data before the save is made
    // If it is not, then it might make sense to save changes when they occur
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
          if (err) {
            return console.error('could not save BPMN 2.0 diagram', err);
          }
          _this.setValue(_this.field, btoa(unescape(encodeURIComponent(xml))));
        });

    return true;
  };

  /**
   * Handles element removal
   * @return {void}
   */
  C.prototype.remove = function() {
    $wrapper.remove();
  };

  return C;
})(H5P.jQuery);
