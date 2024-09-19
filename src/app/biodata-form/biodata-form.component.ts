import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BiodataService } from '../biodata.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-biodata-form',
  templateUrl: './biodata-form.component.html',
  styleUrls: ['./biodata-form.component.css']
})
export class BiodataFormComponent implements OnInit {
  biodataForm: FormGroup;
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder, private biodataService: BiodataService) {
    this.biodataForm = this.fb.group({
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      dob: ['', Validators.required],
      nationality: ['', Validators.required],
      address: ['', Validators.required],
      qualifications: this.fb.array([]),
      documents: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addQualification();
    this.addDocument();
  }

  get qualifications(): FormArray {
    return this.biodataForm.get('qualifications') as FormArray;
  }

  get documents(): FormArray {
    return this.biodataForm.get('documents') as FormArray;
  }

  addQualification() {
    this.qualifications.push(this.fb.group({
      courseName: ['', Validators.required],
      university: ['', Validators.required],
      passingYear: ['', Validators.required],
      percentage: ['', Validators.required]
    }));
  }

  addDocument() {
    this.documents.push(this.fb.group({
      type: ['', Validators.required],
      documentPath: ['', Validators.required]
    }));
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    this.selectedFiles[index] = file;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.biodataForm.value.name);
    formData.append('fatherName', this.biodataForm.value.fatherName);
    formData.append('dob', this.biodataForm.value.dob);
    formData.append('nationality', this.biodataForm.value.nationality);
    formData.append('address', this.biodataForm.value.address);
    formData.append('qualifications', JSON.stringify(this.biodataForm.value.qualifications));

    this.selectedFiles.forEach((file, index) => {
      formData.append('documents[' + index + ']', file);
    });

    this.biodataService.createBiodata(formData).subscribe(response => {
      Swal.fire('Success', 'BioData Submitted!', 'success');
    }, error => {
      Swal.fire('Error', 'Submission Failed', 'error');
    });
  }
}
