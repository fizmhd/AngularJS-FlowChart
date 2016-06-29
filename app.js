
//
// Define the 'app' module.
//angular.module('mySceApp', ['ngSanitize'])
angular.module('app', ['flowChart', 'ngSanitize'])

.filter('html', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}])

//
// Simple service to create a prompt.
//
.factory('prompt', function () {

	/* Uncomment the following to test that the prompt service is working as expected.
	return function () {
		return "Test!";
	}
	*/

	// Return the browsers prompt function.
	return prompt;
})

//
// Application controller.
//
.controller('AppCtrl', ['$scope', 'prompt', function AppCtrl ($scope, prompt) {

	//
	// Code for the delete key.
	//
	var deleteKeyCode = 46;

	//
	// Code for control key.
	//
	var ctrlKeyCode = 17;

	//
	// Set to true when the ctrl key is down.
	//
	var ctrlDown = false;

	//
	// Code for A key.
	//
	var aKeyCode = 65;

	//
	// Code for esc key.
	//
	var escKeyCode = 27;

	//
	// Selects the next node id.
	//
	var nextNodeID = 10;

	//
	// Setup the data-model for the chart.
	//
	var chartDataModel = {
	    "nodes": [
            {
                "name": "Deposit Criteria - <b>200 SEK</b>",
                "id": 0,
                "x": 391,
                "y": 117,
                "width": 200,
                "height": 80,
                "NodeDirection": "Vertical",
                "outputConnectors": [
                    {
                        "name": "A"
                    },
                    {
                        "name": "New connector"
                    }
                ]
            },
            {
                "name": "Netent Bonus<br/> Bonus Code: <b>HHDD003</B>",
                "id": 1,
                "x": 586,
                "y": 315,
                "width": 220,
                "height": 99,
                "NodeDirection": "Vertical",
                "inputConnectors": [
                    {
                        "name": "A"
                    }
                ],
                "outputConnectors": [
                    {
                        "name": "A"
                    }
                ]
            },
            {
                "name": "Turn Over Criteria<br/> Min Turn Over: <b>200 SEK</b>",
                "id": 10,
                "x": 143,
                "y": 303,
                "width": 200,
                "height": 99,
                "NodeDirection": "Vertical",
                "inputConnectors": [
                    {
                        "name": "X"
                    }
                ],
                "outputConnectors": [
                    {
                        "name": "1"
                    }
                ]
            },
            {
                "name": "Call Center Criteria",
                "id": 11,
                "x": 380,
                "y": 592,
                "width": 200,
                "height": 80,
                "NodeDirection": "Vertical",
                "inputConnectors": [
                    {
                        "name": "X"
                    },
                    {
                        "name": "X"
                    }
                ]
            }
	    ],
	    "connections": [
            {
                "source": {
                    "nodeID": 0,
                    "connectorIndex": 0
                },
                "dest": {
                    "nodeID": 1,
                    "connectorIndex": 0
                }
            },
            {
                "source": {
                    "nodeID": 0,
                    "connectorIndex": 1
                },
                "dest": {
                    "nodeID": 10,
                    "connectorIndex": 0
                }
            },
            {
                "source": {
                    "nodeID": 10,
                    "connectorIndex": 0
                },
                "dest": {
                    "nodeID": 11,
                    "connectorIndex": 1
                }
            },
            {
                "source": {
                    "nodeID": 1,
                    "connectorIndex": 0
                },
                "dest": {
                    "nodeID": 11,
                    "connectorIndex": 0
                }
            }
	    ]
	};

	//
	// Event handler for key-down on the flowchart.
    //
    
	$scope.keyDown = function (evt) {

		if (evt.keyCode === ctrlKeyCode) {

			ctrlDown = true;
			evt.stopPropagation();
			evt.preventDefault();
		}
	};
        $scope.nodesSelectChanged = function(nodes, sel) {
            alert(nodes  + ' - ' + sel.toString());
        };

	//
	// Event handler for key-up on the flowchart.
	//
	$scope.keyUp = function (evt) {

		if (evt.keyCode === deleteKeyCode) {
			//
			// Delete key.
			//
			$scope.chartViewModel.deleteSelected();
		}

		if (evt.keyCode == aKeyCode && ctrlDown) {
			// 
			// Ctrl + A
			//
			$scope.chartViewModel.selectAll();
		}

		if (evt.keyCode == escKeyCode) {
			// Escape.
			$scope.chartViewModel.deselectAll();
		}

		if (evt.keyCode === ctrlKeyCode) {
			ctrlDown = false;

			evt.stopPropagation();
			evt.preventDefault();
		}
	};

	//
	// Add a new node to the chart.
	//
	$scope.addNewNode = function () {

		var nodeName = prompt("Enter a node name:", "New node");
		if (!nodeName) {
			return;
		}

		//
		// Template for a new node.
		//
		var newNodeDataModel = {
			name: nodeName,
			id: nextNodeID++,
			x: 0,
			y: 0,
			width: 200,
			height: 80,
			NodeDirection: "Vertical",
			inputConnectors: [
				{
					name: "X"
				}
			],
			outputConnectors: [ 
				{
					name: "1"
				}
			],
		};

		$scope.chartViewModel.addNode(newNodeDataModel);
	};

	//
	// Add an input connector to selected nodes.
	//
	$scope.addNewInputConnector = function () {
		var connectorName = prompt("Enter a connector name:", "New connector");
		if (!connectorName) {
			return;
		}

		var selectedNodes = $scope.chartViewModel.getSelectedNodes();
		for (var i = 0; i < selectedNodes.length; ++i) {
			var node = selectedNodes[i];
			node.addInputConnector({
				name: connectorName,
			});
		}
	};

	//
	// Add an output connector to selected nodes.
	//
	$scope.addNewOutputConnector = function () {
		var connectorName = prompt("Enter a connector name:", "New connector");
		if (!connectorName) {
			return;
		}

		var selectedNodes = $scope.chartViewModel.getSelectedNodes();
		for (var i = 0; i < selectedNodes.length; ++i) {
			var node = selectedNodes[i];
			node.addOutputConnector({
				name: connectorName,
			});
		}
	};

	//
	// Delete selected nodes and connections.
	//
	$scope.deleteSelected = function () {

		$scope.chartViewModel.deleteSelected();
	};

	//
	// Create the view-model for the chart and attach to the scope.
	//
	$scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
}])
;