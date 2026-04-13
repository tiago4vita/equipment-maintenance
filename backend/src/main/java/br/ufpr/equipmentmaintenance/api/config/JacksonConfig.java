package br.ufpr.equipmentmaintenance.api.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

/**
 * JSON de datas no padrão brasileiro (enunciado), sem "T" no meio da data/hora.
 * Entrada: aceita ISO-8601 ou dd/MM/yyyy HH:mm para facilitar integração.
 */
@Configuration
public class JacksonConfig {

    private static final ZoneId BR = ZoneId.of("America/Sao_Paulo");

    private static final DateTimeFormatter OUT_DATE_TIME = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter OUT_DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter OUT_INSTANT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss").withZone(BR);

    private static final DateTimeFormatter IN_DATE_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jacksonCustomizer() {
        return builder -> {
            builder.serializers(new LocalDateTimeSerializer(OUT_DATE_TIME));
            builder.serializers(new LocalDateSerializer(OUT_DATE));
            // serializerByType / deserializerByType: anônimos não expõem o tipo para Jackson2ObjectMapperBuilder
            builder.serializerByType(Instant.class, new JsonSerializer<Instant>() {
                @Override
                public void serialize(Instant value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
                    if (value == null) {
                        gen.writeNull();
                    } else {
                        gen.writeString(OUT_INSTANT.format(value));
                    }
                }
            });

            builder.deserializerByType(LocalDateTime.class, new JsonDeserializer<LocalDateTime>() {
                @Override
                public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
                    String s = p.getValueAsString();
                    if (s == null || s.isBlank()) {
                        return null;
                    }
                    try {
                        return LocalDateTime.parse(s, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                    } catch (DateTimeParseException e) {
                        try {
                            return LocalDateTime.parse(s, OUT_DATE_TIME);
                        } catch (DateTimeParseException e2) {
                            return LocalDateTime.parse(s, DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
                        }
                    }
                }
            });

            builder.deserializerByType(LocalDate.class, new JsonDeserializer<LocalDate>() {
                @Override
                public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
                    String s = p.getValueAsString();
                    if (s == null || s.isBlank()) {
                        return null;
                    }
                    try {
                        return LocalDate.parse(s, DateTimeFormatter.ISO_LOCAL_DATE);
                    } catch (DateTimeParseException e) {
                        return LocalDate.parse(s, IN_DATE_BR);
                    }
                }
            });
        };
    }
}
