'use client'

import { useState, useEffect } from "react"

import Row from "./row"
import settings from '../../conf/environment';

const contentful = require('contentful')

type ContentfulImage = {
    sys: {
        id: string;
    };
    fields: {
        file: {
            url: string;
        }
    };
}

type MissingDataFields = {
    celular: number;
    colonia: string;
    fechaDeReporte: string;
    foto: Array<ContentfulImage>;
    municipio: string;
    nombres: Array<string>;
    encontrado: boolean;
}

type ContentfulItem = {
    sys: {
        id: string;
    };
    items: Array<MissingItem>;
}

export type ImageItem = {
    id: string;
    url: string;
};

export type MissingItem = {
    id: string;
    nombres: Array<string>;
    celular: number;
    fotos: Array<ImageItem>;
    municipio: string;
    encontrado: boolean;
    fechaDeReporte: string;
};

export default function MissingList() {
    const [list, setList] = useState<Array<MissingItem>>([])

    //const MissingList = async () => {
    const client = contentful.createClient({
        space: settings.contentful_space_id,
        accessToken: settings.contentful_access_token,
        // environment: '<environment_id>', // defaults to 'master' if not set
    })

    useEffect(() => {
        client.getEntries()
            .then((response: ContentfulItem) => {
                return response.items
                    .filter((item: any) => {
                        // filter the entry with found
                        return !item.fields.encontrado
                    })
                    .map((item: any) => {
                        const missingItem: MissingItem = {
                            id: item.sys.id,
                            celular: item.fields.celular,
                            fechaDeReporte: item.fields.fechaDeReporte,
                            fotos: item.fields.foto.map((imgObj: ContentfulImage) => {
                                const foto: ImageItem = {
                                    id: imgObj.sys.id,
                                    url: imgObj.fields.file.url,
                                };
                                return foto;
                            }),
                            municipio: item.fields.municipio,
                            nombres: item.fields.nombres,
                            encontrado: item.fields.encontrado,
                        };

                        return missingItem;
                    })
            })
            .then((l: any) => setList(l))
            .catch((err: any) => {
                console.error(err)
                return []
            })
            .finally(() => {
            })
    }, [])

    let dataView = (
        <div>Sin datos</div>
    )
    if (list.length > 0) {
        dataView = (
            <table className="w-full text-md text-left text-gray-500 dark:text-gray-400 border-collapse">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="border border-slate-300 px-6 py-3">
                            Reportado
                        </th>
                        <th scope="col" className="border border-slate-300 px-6 py-3">
                            Nombres
                        </th>
                        <th scope="col" className="border border-slate-300">
                            Celular
                        </th>
                        <th scope="col" className="border border-slate-300 px-6 py-3">
                            Municipio
                        </th>
                        <th scope="col" className="border border-slate-300 px-6 py-3">
                            Imágenes
                        </th>
                        <th scope="col" className="border border-slate-300 px-6 py-3">
                            Encontrado
                        </th>
                        {/*
                        <th scope="col" className="border border-slate-300 px-6 py-3">
                            &nbsp;
                        </th>
                        */}
                    </tr>
                </thead>
                <tbody>
                    {list.map((missing: MissingItem) => (
                        <Row key={missing.id} missing={missing} />
                    ))}
                </tbody>
            </table>
        )
    }

    return (
        <div className="missing-list">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Listado de personas extraviadas
            </h2>
            {dataView}
        </div>
    )
}

// export default MissingList
