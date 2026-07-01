package com.optimetro.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.stereotype.Service;



@Service
public class AlerteService {

    private static final String API_KEY = "pHlRkfAs1qWKQcNsTCd6Bxx4QGg5R2aL"; 
    private static final String URL =
        "https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/line_reports/line_reports";

    public String getAlertesJson() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(URL))
                .header("apiKey", API_KEY)
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

        return response.body();
    }
} 