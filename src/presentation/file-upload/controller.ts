import { UploadedFile } from 'express-fileupload';
import { Request, Response } from "express";
import { CustomErrors } from "../../domain";
import { FileUploadService } from "../services";

export class FileUploadController {


    constructor(
        private readonly fileUploadService: FileUploadService
    ){}

    //Manejo de error generico
    private handleError = (error: unknown , res: Response ) => {
        if(error instanceof CustomErrors){
            return res.status(error.statusCode).json({error: error.message });
        }

        console.log('----- handleError: ', error);
        return res.json(500).json({ error: 'Internal server error'})
    }

    //subir archivo
    public uploadFile = async(req , res: Response) => {
        const types = req.params.type;
        const file = req.body.files.at(0) as UploadedFile;

        this.fileUploadService.uploadSingle(file, `uploads/${types}`)
            .then( uploaded => res.json(uploaded) )
            .catch( error => this.handleError( error, res) )

    }


    //subir Multiples archivos
    public uploadMultipleFile = async(req , res: Response) => {
        const types = req.params.type;
        const files = req.body.files as UploadedFile;

        this.fileUploadService.uploadMultiple(files, `uploads/${types}`)
            .then( uploaded => res.json(uploaded) )
            .catch( error => this.handleError( error, res) )

    }


   

}