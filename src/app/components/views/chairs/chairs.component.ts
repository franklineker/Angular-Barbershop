import { Chair } from 'src/app/models/chair.model';
import { Component, OnInit } from '@angular/core';
import { ChairsService } from 'src/app/services/chairs/chairs.service';
import { BarbersService } from 'src/app/services/barbers/barbers.service';
import { Barber } from 'src/app/models/barber.model';
import { DeleteDialogComponent } from '../../templates/delete-dialog/delete-dialog.component';
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-chairs',
    templateUrl: './chairs.component.html',
    styleUrls: ['./chairs.component.css']
})
export class ChairsComponent implements OnInit {

    chairs!: Chair[];
    selectedStartDate!: Date;
    selectedEndDate!: Date;
    idArray!: Number[];
    barbers!: Barber[];
    barber = new Barber;
    chair = new Chair;
    submitType!: string;

    constructor(
        private chairService: ChairsService,
        private barbersService: BarbersService,
        private deleteDialog: DeleteDialogComponent,
        private datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.chairService.findChairs().subscribe(chairs => {
            let index = 1
            this.chairs = chairs.map(c => {
                c.customId = index
                index++
                c.formatedStartDate = this.datePipe.transform(c.startDate, "dd/MM/yyyy")!;
                c.formatedEndDate = this.datePipe.transform(c.endDate, "dd/MM/yyyy")!;
                return c
            })
        })
        this.barbersService.getBarbers().subscribe(barbers => {
            this.barbers = barbers
        })
    }

    saveChair(): void {
        if (!this.chair.barber.person.name) {
            alert("Por favor, selecione um barbeiro para contiuar");
            return;
        } else if (!this.chair.startDate) {
            alert("Por favor, selecione uma data início para contiuar");
            return;
        } else if (!this.chair.endDate) {
            alert("Por favor, selecione uma data fim para contiuar");
            return;
        }
        if (this.submitType == "createChair") {
            this.chairService.createChair(this.chair).subscribe(chair => {
                alert("Cadeira salva com sucesso!");
                window.location.reload();
            })
        } else if (this.submitType == "editChair") {
            this.chairService.updateChair(this.chair).subscribe(chair => {
                alert("Cadeira salva com sucesso!");
                window.location.reload();
            })
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
        this.chair = new Chair();
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
            this.chair.startDate = undefined;
            this.chair.endDate = undefined;
        }
    }
}
