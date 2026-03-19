package br.ufpr.equipmentmaintenance.api.util;

import org.springframework.stereotype.Component;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class SenhaUtil {

    public String criptografar(String senha) {
        try {
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[16];
            random.nextBytes(salt);

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt); 
            byte[] hashedPassword = md.digest(senha.getBytes());

            String encodedSalt = Base64.getEncoder().encodeToString(salt);
            String encodedHash = Base64.getEncoder().encodeToString(hashedPassword);

            return encodedSalt + ":" + encodedHash; 
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao criptografar a senha", e);
        }
    }

    public boolean validarSenha(String senhaDigitada, String senhaArmazenada) {
        try {
            String[] partes = senhaArmazenada.split(":");
            byte[] salt = Base64.getDecoder().decode(partes[0]);
            String hashOriginal = partes[1];

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashTentativa = md.digest(senhaDigitada.getBytes());
            String tentativaCodificada = Base64.getEncoder().encodeToString(hashTentativa);

            return hashOriginal.equals(tentativaCodificada);
        } catch (Exception e) {
            return false;
        }
    }
}