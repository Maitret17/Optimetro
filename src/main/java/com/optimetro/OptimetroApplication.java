package com.optimetro;

import com.optimetro.algorithm.Connectivity;
import com.optimetro.algorithm.ConnectivityResult;
import com.optimetro.model.StationNode;
import com.optimetro.service.GraphService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.Arrays;

@SpringBootApplication
public class OptimetroApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(OptimetroApplication.class, args);

		if (Arrays.asList(args).contains("connectivity")) {
			GraphService graphService = context.getBean(GraphService.class);

			ConnectivityResult result = Connectivity.test(graphService.getGraph());

			System.out.println();
			System.out.println("===== CONNECTIVITY TEST =====");
			System.out.println("Total stations: " + result.getTotalStations());
			System.out.println("Visited stations: " + result.getVisitedStations());

			if (result.isConnected()) {
				System.out.println("Result: The graph is connected.");
			} else {
				System.out.println("Result: The graph is NOT connected.");
				System.out.println("Unreachable stations: " + result.getUnreachableStations().size());

				int limit = Math.min(20, result.getUnreachableStations().size());

				for (int i = 0; i < limit; i++) {
					StationNode station = result.getUnreachableStations().get(i);
					System.out.println("- " + station);
				}

				if (result.getUnreachableStations().size() > 20) {
					System.out.println("... and more");
				}
			}

			System.out.println("=============================");
			System.out.println();

			SpringApplication.exit(context);
		}
	}
}