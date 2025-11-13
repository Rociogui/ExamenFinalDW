package com.empresa.c;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.UUID;
public class Utils {
 public static double calcularTotal(List<Double> valores) {
        if (valores == null || valores.isEmpty()) return 0.0;
        return valores.stream().mapToDouble(Double::doubleValue).sum();
    }

    public static String generarCodigoUnico(String tipo) {
    return tipo.toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

    }

   
    public static String invocarEndpointGET(String urlStr) throws Exception {
        URL url = new URL(urlStr);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");
        con.setConnectTimeout(5000);
        con.setReadTimeout(5000);

        int status = con.getResponseCode();
        BufferedReader in = new BufferedReader(new InputStreamReader(
                status >= 200 && status < 300 ? con.getInputStream() : con.getErrorStream()
        ));
        StringBuilder content = new StringBuilder();
        String line;
        while ((line = in.readLine()) != null) content.append(line);
        in.close();
        con.disconnect();
        return content.toString();
    }
}
