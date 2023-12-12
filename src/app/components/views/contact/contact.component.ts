import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent {

    form: FormGroup = this.fb.group({
        form_name: '',
        to_name: 'Administrador',
        from_name: '',
        from_email: '',
        subject: '',
        message: ''
    });

    constructor(private fb: FormBuilder) { }

    async send() {
        emailjs.init("D3VN6F4UjuM4hj6AM");
        if (
            this.nameControl?.invalid ||
            this.emailControl?.invalid ||
            this.messageControl?.invalid
        ) {
            return alert("Por favor, preencha os campos obrigatórios (*).")
        }

        await emailjs.send("service_lq236ni", "template_ypcnztv", {
            from_name: this.form.value.from_name,
            to_name: this.form.value.to_nama,
            from_email: this.form.value.from_email,
            subject: this.form.value.subject,
            message: this.form.value.message
        })
        alert("Mensagem enviada com sucesso!");
        this.form.reset();
    }

    get nameControl() {
        return this.form.get('from_name');
    }
    get emailControl() {
        return this.form.get('from_email');
    }
    get messageControl() {
        return this.form.get('message');
    }

}
