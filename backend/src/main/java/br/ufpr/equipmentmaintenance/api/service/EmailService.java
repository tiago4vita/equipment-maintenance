package br.ufpr.equipmentmaintenance.api.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envia a senha gerada automaticamente ao cliente recém-cadastrado (RF001).
     */
    public void enviarSenhaAutocadastro(String destinatario, String nomeCliente, String senha) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(destinatario);
        mensagem.setSubject("Bem-vindo(a) ao Equipment Maintenance — sua senha de acesso");
        mensagem.setText(
            "Olá, " + nomeCliente + "!\n\n" +
            "Seu cadastro foi realizado com sucesso.\n\n" +
            "Sua senha de acesso é: " + senha + "\n\n" +
            "Recomendamos que você guarde essa senha em local seguro.\n\n" +
            "Atenciosamente,\n" +
            "Equipe Equipment Maintenance"
        );

        mailSender.send(mensagem);
    }
}