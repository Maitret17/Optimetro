package com.optimetro.controller;

import com.optimetro.algorithm.ConnectivityResult;
import com.optimetro.service.GraphService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class GraphController {
    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @GetMapping("/api/graph/connectivity")
    public ConnectivityResult testConnectivity() {
        return graphService.testConnectivity();
    }
}