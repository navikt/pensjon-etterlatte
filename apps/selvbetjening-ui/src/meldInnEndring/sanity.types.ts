/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
    _type: 'sanity.imagePaletteSwatch'
    background?: string
    foreground?: string
    population?: number
    title?: string
}

export type SanityImagePalette = {
    _type: 'sanity.imagePalette'
    darkMuted?: SanityImagePaletteSwatch
    lightVibrant?: SanityImagePaletteSwatch
    darkVibrant?: SanityImagePaletteSwatch
    vibrant?: SanityImagePaletteSwatch
    dominant?: SanityImagePaletteSwatch
    lightMuted?: SanityImagePaletteSwatch
    muted?: SanityImagePaletteSwatch
}

export type SanityImageDimensions = {
    _type: 'sanity.imageDimensions'
    height?: number
    width?: number
    aspectRatio?: number
}

export type SanityImageHotspot = {
    _type: 'sanity.imageHotspot'
    x?: number
    y?: number
    height?: number
    width?: number
}

export type SanityImageCrop = {
    _type: 'sanity.imageCrop'
    top?: number
    bottom?: number
    left?: number
    right?: number
}

export type SanityFileAsset = {
    _id: string
    _type: 'sanity.fileAsset'
    _createdAt: string
    _updatedAt: string
    _rev: string
    originalFilename?: string
    label?: string
    title?: string
    description?: string
    altText?: string
    sha1hash?: string
    extension?: string
    mimeType?: string
    size?: number
    assetId?: string
    uploadId?: string
    path?: string
    url?: string
    source?: SanityAssetSourceData
}

export type SanityImageAsset = {
    _id: string
    _type: 'sanity.imageAsset'
    _createdAt: string
    _updatedAt: string
    _rev: string
    originalFilename?: string
    label?: string
    title?: string
    description?: string
    altText?: string
    sha1hash?: string
    extension?: string
    mimeType?: string
    size?: number
    assetId?: string
    uploadId?: string
    path?: string
    url?: string
    metadata?: SanityImageMetadata
    source?: SanityAssetSourceData
}

export type SanityImageMetadata = {
    _type: 'sanity.imageMetadata'
    location?: Geopoint
    dimensions?: SanityImageDimensions
    palette?: SanityImagePalette
    lqip?: string
    blurHash?: string
    hasAlpha?: boolean
    isOpaque?: boolean
}

export type Geopoint = {
    _type: 'geopoint'
    lat?: number
    lng?: number
    alt?: number
}

export type Slug = {
    _type: 'slug'
    current?: string
    source?: string
}

export type SanityAssetSourceData = {
    _type: 'sanity.assetSourceData'
    name?: string
    id?: string
    url?: string
}

export type MeldInnEndringKvittering = {
    _id: string
    _type: 'meldInnEndringKvittering'
    _createdAt: string
    _updatedAt: string
    _rev: string
    dokumentTittel?: string
    tittel?: {
        NB?: string
        NN?: string
        EN?: string
    }
    suksess?: {
        NB?: Array<{
            children?: Array<{
                marks?: Array<string>
                text?: string
                _type: 'span'
                _key: string
            }>
            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
            listItem?: 'bullet' | 'number'
            markDefs?: Array<{
                href?: string
                _type: 'link'
                _key: string
            }>
            level?: number
            _type: 'block'
            _key: string
        }>
        NN?: Array<{
            children?: Array<{
                marks?: Array<string>
                text?: string
                _type: 'span'
                _key: string
            }>
            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
            listItem?: 'bullet' | 'number'
            markDefs?: Array<{
                href?: string
                _type: 'link'
                _key: string
            }>
            level?: number
            _type: 'block'
            _key: string
        }>
        EN?: Array<{
            children?: Array<{
                marks?: Array<string>
                text?: string
                _type: 'span'
                _key: string
            }>
            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
            listItem?: 'bullet' | 'number'
            markDefs?: Array<{
                href?: string
                _type: 'link'
                _key: string
            }>
            level?: number
            _type: 'block'
            _key: string
        }>
    }
    gaaTilNAVKnapp?: {
        tekst?: {
            NB?: string
            NN?: string
            EN?: string
        }
        lenke?: {
            NB?: string
            NN?: string
            EN?: string
        }
    }
}

export type MeldInnEndringOppsummering = {
    _id: string
    _type: 'meldInnEndringOppsummering'
    _createdAt: string
    _updatedAt: string
    _rev: string
    dokumentTittel?: string
    veiledning?: {
        NB?: Array<{
            children?: Array<{
                marks?: Array<string>
                text?: string
                _type: 'span'
                _key: string
            }>
            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
            listItem?: 'bullet' | 'number'
            markDefs?: Array<{
                href?: string
                _type: 'link'
                _key: string
            }>
            level?: number
            _type: 'block'
            _key: string
        }>
        NN?: Array<{
            children?: Array<{
                marks?: Array<string>
                text?: string
                _type: 'span'
                _key: string
            }>
            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
            listItem?: 'bullet' | 'number'
            markDefs?: Array<{
                href?: string
                _type: 'link'
                _key: string
            }>
            level?: number
            _type: 'block'
            _key: string
        }>
        EN?: Array<{
            children?: Array<{
                marks?: Array<string>
                text?: string
                _type: 'span'
                _key: string
            }>
            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
            listItem?: 'bullet' | 'number'
            markDefs?: Array<{
                href?: string
                _type: 'link'
                _key: string
            }>
            level?: number
            _type: 'block'
            _key: string
        }>
    }
    skjemaSammendrag?: {
        tittel?: {
            NB?: string
            NN?: string
            EN?: string
        }
        endreSvarLenke?: {
            tekst?: {
                NB?: string
                NN?: string
                EN?: string
            }
        }
        endring?: {
            label?: {
                NB?: string
                NN?: string
                EN?: string
            }
            value?: {
                aktivitetOgInntekt?: {
                    NB?: string
                    NN?: string
                    EN?: string
                }
                inntekt?: {
                    NB?: string
                    NN?: string
                    EN?: string
                }
                annet?: {
                    NB?: string
                    NN?: string
                    EN?: string
                }
            }
        }
        beskrivelseAvEndring?: {
            label?: {
                NB?: string
                NN?: string
                EN?: string
            }
        }
    }
    feilIOppretelseAvEndring?: {
        tittel?: {
            NB?: string
            NN?: string
            EN?: string
        }
        innhold?: {
            NB?: Array<{
                children?: Array<{
                    marks?: Array<string>
                    text?: string
                    _type: 'span'
                    _key: string
                }>
                style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                listItem?: 'bullet' | 'number'
                markDefs?: Array<{
                    href?: string
                    _type: 'link'
                    _key: string
                }>
                level?: number
                _type: 'block'
                _key: string
            }>
            NN?: Array<{
                children?: Array<{
                    marks?: Array<string>
                    text?: string
                    _type: 'span'
                    _key: string
                }>
                style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                listItem?: 'bullet' | 'number'
                markDefs?: Array<{
                    href?: string
                    _type: 'link'
                    _key: string
                }>
                level?: number
                _type: 'block'
                _key: string
            }>
            EN?: Array<{
                children?: Array<{
                    marks?: Array<string>
                    text?: string
                    _type: 'span'
                    _key: string
                }>
                style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                listItem?: 'bullet' | 'number'
                markDefs?: Array<{
                    href?: string
                    _type: 'link'
                    _key: string
                }>
                level?: number
                _type: 'block'
                _key: string
            }>
        }
    }
}

export type MeldInnEndringMeldFra = {
    _id: string
    _type: 'meldInnEndringMeldFra'
    _createdAt: string
    _updatedAt: string
    _rev: string
    dokumentTittel?: string
    tittel?: {
        NB?: string
        NN?: string
        EN?: string
    }
    endring?: {
        legend?: {
            NB?: string
            NN?: string
            EN?: string
        }
        description?: {
            NB?: string
            NN?: string
            EN?: string
        }
        radios?: {
            aktivitetOgInntekt?: {
                label?: {
                    NB?: string
                    NN?: string
                    EN?: string
                }
                description?: {
                    NB?: string
                    NN?: string
                    EN?: string
                }
            }
            inntekt?: {
                label?: {
                    NB?: string
                    NN?: string
                    EN?: string
                }
            }
            annet?: {
                label?: {
                    NB?: string
                    NN?: string
                    EN?: string
                }
            }
        }
        errorVedTomInput?: {
            NB?: string
            NN?: string
            EN?: string
        }
    }
    informasjonOmEndring?: {
        aktivitetOgInntekt?: {
            tittel?: {
                NB?: string
                NN?: string
                EN?: string
            }
            endringAccordion?: {
                jobbItem?: {
                    tittel?: {
                        NB?: string
                        NN?: string
                        EN?: string
                    }
                    innhold?: {
                        NB?: Array<{
                            children?: Array<{
                                marks?: Array<string>
                                text?: string
                                _type: 'span'
                                _key: string
                            }>
                            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                            listItem?: 'bullet' | 'number'
                            markDefs?: Array<{
                                href?: string
                                _type: 'link'
                                _key: string
                            }>
                            level?: number
                            _type: 'block'
                            _key: string
                        }>
                        NN?: Array<{
                            children?: Array<{
                                marks?: Array<string>
                                text?: string
                                _type: 'span'
                                _key: string
                            }>
                            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                            listItem?: 'bullet' | 'number'
                            markDefs?: Array<{
                                href?: string
                                _type: 'link'
                                _key: string
                            }>
                            level?: number
                            _type: 'block'
                            _key: string
                        }>
                        EN?: Array<{
                            children?: Array<{
                                marks?: Array<string>
                                text?: string
                                _type: 'span'
                                _key: string
                            }>
                            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                            listItem?: 'bullet' | 'number'
                            markDefs?: Array<{
                                href?: string
                                _type: 'link'
                                _key: string
                            }>
                            level?: number
                            _type: 'block'
                            _key: string
                        }>
                    }
                }
                studierItem?: {
                    tittel?: {
                        NB?: string
                        NN?: string
                        EN?: string
                    }
                    innhold?: {
                        NB?: Array<{
                            children?: Array<{
                                marks?: Array<string>
                                text?: string
                                _type: 'span'
                                _key: string
                            }>
                            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                            listItem?: 'bullet' | 'number'
                            markDefs?: Array<{
                                href?: string
                                _type: 'link'
                                _key: string
                            }>
                            level?: number
                            _type: 'block'
                            _key: string
                        }>
                        NN?: Array<{
                            children?: Array<{
                                marks?: Array<string>
                                text?: string
                                _type: 'span'
                                _key: string
                            }>
                            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                            listItem?: 'bullet' | 'number'
                            markDefs?: Array<{
                                href?: string
                                _type: 'link'
                                _key: string
                            }>
                            level?: number
                            _type: 'block'
                            _key: string
                        }>
                        EN?: Array<{
                            children?: Array<{
                                marks?: Array<string>
                                text?: string
                                _type: 'span'
                                _key: string
                            }>
                            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                            listItem?: 'bullet' | 'number'
                            markDefs?: Array<{
                                href?: string
                                _type: 'link'
                                _key: string
                            }>
                            level?: number
                            _type: 'block'
                            _key: string
                        }>
                    }
                }
                annenAktivitetItem?: {
                    tittel?: {
                        NB?: string
                        NN?: string
                        EN?: string
                    }
                    innhold?: {
                        NB?: Array<{
                            children?: Array<{
                                marks?: Array<string>
                                text?: string
                                _type: 'span'
                                _key: string
                            }>
                            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                            listItem?: 'bullet' | 'number'
                            markDefs?: Array<{
                                href?: string
                                _type: 'link'
                                _key: string
                            }>
                            level?: number
                            _type: 'block'
                            _key: string
                        }>
                        NN?: Array<{
                            children?: Array<{
                                marks?: Array<string>
                                text?: string
                                _type: 'span'
                                _key: string
                            }>
                            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                            listItem?: 'bullet' | 'number'
                            markDefs?: Array<{
                                href?: string
                                _type: 'link'
                                _key: string
                            }>
                            level?: number
                            _type: 'block'
                            _key: string
                        }>
                        EN?: Array<{
                            children?: Array<{
                                marks?: Array<string>
                                text?: string
                                _type: 'span'
                                _key: string
                            }>
                            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                            listItem?: 'bullet' | 'number'
                            markDefs?: Array<{
                                href?: string
                                _type: 'link'
                                _key: string
                            }>
                            level?: number
                            _type: 'block'
                            _key: string
                        }>
                    }
                }
            }
            hovedinnhold?: {
                NB?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                NN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                EN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
            }
        }
        inntekt?: {
            tittel?: {
                NB?: string
                NN?: string
                EN?: string
            }
            hovedinnhold?: {
                NB?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                NN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                EN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
            }
            hvorforViSpoerOmInntektReadMore?: {
                tittel?: {
                    NB?: string
                    NN?: string
                    EN?: string
                }
                innhold?: {
                    NB?: string
                    NN?: string
                    EN?: string
                }
            }
            svarPaaSpoersmaal?: {
                NB?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                NN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                EN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
            }
        }
        annet?: {
            tittel?: {
                NB?: string
                NN?: string
                EN?: string
            }
            hovedinnhold?: {
                NB?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                NN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                EN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
            }
            endreKontaktEllerKontonummerAlert?: {
                tittel?: {
                    NB?: string
                    NN?: string
                    EN?: string
                }
                innhold?: {
                    NB?: Array<{
                        children?: Array<{
                            marks?: Array<string>
                            text?: string
                            _type: 'span'
                            _key: string
                        }>
                        style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                        listItem?: 'bullet' | 'number'
                        markDefs?: Array<{
                            href?: string
                            _type: 'link'
                            _key: string
                        }>
                        level?: number
                        _type: 'block'
                        _key: string
                    }>
                    NN?: Array<{
                        children?: Array<{
                            marks?: Array<string>
                            text?: string
                            _type: 'span'
                            _key: string
                        }>
                        style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                        listItem?: 'bullet' | 'number'
                        markDefs?: Array<{
                            href?: string
                            _type: 'link'
                            _key: string
                        }>
                        level?: number
                        _type: 'block'
                        _key: string
                    }>
                    EN?: Array<{
                        children?: Array<{
                            marks?: Array<string>
                            text?: string
                            _type: 'span'
                            _key: string
                        }>
                        style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                        listItem?: 'bullet' | 'number'
                        markDefs?: Array<{
                            href?: string
                            _type: 'link'
                            _key: string
                        }>
                        level?: number
                        _type: 'block'
                        _key: string
                    }>
                }
            }
            detViTrengerForAaBehandleEndring?: {
                NB?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                NN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                EN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
            }
        }
    }
    beskrivelseAvEndring?: {
        label?: {
            NB?: string
            NN?: string
            EN?: string
        }
        description?: {
            NB?: string
            NN?: string
            EN?: string
        }
        readMore?: {
            tittel?: {
                NB?: string
                NN?: string
                EN?: string
            }
            innhold?: {
                NB?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                NN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
                EN?: Array<{
                    children?: Array<{
                        marks?: Array<string>
                        text?: string
                        _type: 'span'
                        _key: string
                    }>
                    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
                    listItem?: 'bullet' | 'number'
                    markDefs?: Array<{
                        href?: string
                        _type: 'link'
                        _key: string
                    }>
                    level?: number
                    _type: 'block'
                    _key: string
                }>
            }
        }
        errorVedTomInput?: {
            NB?: string
            NN?: string
            EN?: string
        }
    }
}

export type MeldInnEndringInnledning = {
    _id: string
    _type: 'meldInnEndringInnledning'
    _createdAt: string
    _updatedAt: string
    _rev: string
    dokumentTittel?: string
    hovedinnhold?: {
        NB?: Array<{
            children?: Array<{
                marks?: Array<string>
                text?: string
                _type: 'span'
                _key: string
            }>
            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
            listItem?: 'bullet' | 'number'
            markDefs?: Array<{
                href?: string
                _type: 'link'
                _key: string
            }>
            level?: number
            _type: 'block'
            _key: string
        }>
        NN?: Array<{
            children?: Array<{
                marks?: Array<string>
                text?: string
                _type: 'span'
                _key: string
            }>
            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
            listItem?: 'bullet' | 'number'
            markDefs?: Array<{
                href?: string
                _type: 'link'
                _key: string
            }>
            level?: number
            _type: 'block'
            _key: string
        }>
        EN?: Array<{
            children?: Array<{
                marks?: Array<string>
                text?: string
                _type: 'span'
                _key: string
            }>
            style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
            listItem?: 'bullet' | 'number'
            markDefs?: Array<{
                href?: string
                _type: 'link'
                _key: string
            }>
            level?: number
            _type: 'block'
            _key: string
        }>
    }
    startUtfyllingKnapp?: {
        NB?: string
        NN?: string
        EN?: string
    }
}

export type AllSanitySchemaTypes =
    | SanityImagePaletteSwatch
    | SanityImagePalette
    | SanityImageDimensions
    | SanityImageHotspot
    | SanityImageCrop
    | SanityFileAsset
    | SanityImageAsset
    | SanityImageMetadata
    | Geopoint
    | Slug
    | SanityAssetSourceData
    | MeldInnEndringKvittering
    | MeldInnEndringOppsummering
    | MeldInnEndringMeldFra
    | MeldInnEndringInnledning
export declare const internalGroqTypeReferenceTo: unique symbol