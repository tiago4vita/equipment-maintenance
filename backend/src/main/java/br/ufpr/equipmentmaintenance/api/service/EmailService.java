package br.ufpr.equipmentmaintenance.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envia a senha gerada automaticamente ao cliente recém-cadastrado (RF001).
     * Falhas de envio são registradas mas não interrompem o fluxo: o cadastro
     * permanece válido e a senha continua disponível ao usuário pela resposta da API.
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

        try {
            mailSender.send(mensagem);
        } catch (MailException ex) {
            log.warn("Falha ao enviar e-mail de autocadastro para {}: {}", destinatario, ex.getMessage());
            log.debug("Stack trace do envio de e-mail", ex);
        }
    }
}
