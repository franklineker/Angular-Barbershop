import { Chair } from 'src/app/models/chair.model';
import { Component, OnInit } from '@angular/core';
import { ChairsService } from 'src/app/services/chairs/chairs.service';
import { BarbersService } from 'src/app/services/barbers/barbers.service';
import { Barber } from 'src/app/models/barber.model';
import { DeleteDialogComponent } from '../../templates/delete-dialog/delete-dialog.component';

@Component({
    selector: 'app-chairs',
    templateUrl: './chairs.component.html',
    styleUrls: ['./chairs.component.css']
})
export class ChairsComponent implements OnInit {

    chairs!: Chair[];
    idArray!: Number[];
    barber!: Barber;
    chair: Chair = {
        barberName: "",
        startDate: "",
        endDate: ""
    };
    submitType!: string;

    constructor(
        private chairService: ChairsService,
        private barbersService: BarbersService,
        private deleteDialog: DeleteDialogComponent
    ) { }

    ngOnInit(): void {
        this.chairService.findChairs().subscribe(chairs => {
            let index = 1
            this.chairs = chairs.map(c => {
                c.customId = index
                index++
                return c
            })
            console.log(this.chairs)
        })
    }

    saveChair(): void {
        const barberName = $("#barberName").val()?.toString()!;
        const startDate = $("#startDate").val()?.toString()!;
        const endDate = $("#endDate").val()?.toString()!;
        const chair: Chair = {
            barberName: barberName,
            startDate: startDate,
            endDate: endDate

        }

        console.log(this.submitType)
        if (this.submitType == "createChair") {
            console.log("entrou no create")
            this.chairService.createChair(chair).subscribe(chair => {
                console.log(chair);
                alert("Cadeira salva com sucesso!");
                window.location.reload();
            })
        } else if (this.submitType == "editChair") {
            this.chairService.updateChair(this.chair).subscribe(chair => {
                console.log(chair);
                alert("Cadeira salva com sucesso!");
                window.location.reload();
            })
            console.log("entrou no edit", this.chair.id)
        }

    }

    deleteChair(event: any, chair: Chair): void {
        this.deleteDialog.openDialog(event);
        this.chairService.setChairToDelete(chair);
    }

    closeForm(): void {
        document.getElementById('myForm')!.style.display = 'none';
    }

    openForm(event: any, chair: Chair): void {
        const buttonName = event.currentTarget.getAttribute('name');

        if (buttonName == 'editChair') {
            this.submitType = 'editChair';
            $('h2').text('Editar Cadeira');
            this.chair = chair;
            document.getElementById('myForm')!.style.display = 'block';
        } else if (buttonName == 'createChair') {
            this.submitType = 'createChair';
            $('h2').text('Nova Cadeira');
            $("form[name='chairForm']")
                .find("[type='text'")
                .val('')
                .end()
                .find("[type='number']")
                .val('');
            document.getElementById('myForm')!.style.display = 'block';
        }
    }
}
