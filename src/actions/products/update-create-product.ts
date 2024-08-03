import { isAxiosError } from "axios";
import { tesloApi } from "../../config/api/tesloApi";
import { Product } from "../../domain/entities/product.entity";



const prepareImages = async( images: string[] ) => {

    //todo: revisar los files
    const fileImages = images.filter( img => img.includes('file://'));
    const currentImages = images.filter( img => !img.includes('file://'));


    if( fileImages.length > 0) {
        const uploadPromises = fileImages.map( uploadImage );
        const uploadImages = await Promise.all(uploadPromises);
        currentImages.push(...uploadImages);

    }

    return currentImages.map( img => img.split('/').pop())
}

const uploadImage = async( image: string) => {
    const formData = new FormData();
    formData.append('file', {
        uri: image,
        type: 'image/jpeg',
        name: image.split('/').pop()
    });

    const { data } = await tesloApi.post<{ image: string }>('/files/product', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return data.image;
}


export const updateCreateProduct = ( product: Partial<Product> ) => {

    product.stock = Number(product.stock);
    product.price = Number(product.price);


    if(product.id && product.id !== 'new') {
        return updateProduct( product );
    }


    return createProduct( product );
}

//TODO: revisar si viene el usuario
const updateProduct = async( product: Partial<Product> ) => {
    console.log(product);
    const {id, images = [], ...rest} = product;

    try {
        const checkImages = await prepareImages( images);
    
        const { data } = await tesloApi.patch(`/products/${id}`, {
            images: checkImages,
            ...rest
        });

        return data;
        
    } catch (error) {
        if( isAxiosError(error) ) {
            console.log(error.response?.data);
        }

        throw new Error(`Error al actualizar el producto`);

    }

}

const createProduct = async( product: Partial<Product> ) => {

    const {id, images = [], ...rest} = product;

    try {
        const checkImages = await prepareImages( images);
    
        const { data } = await tesloApi.post(`/products`, {
            images: checkImages,
            ...rest
        });

        return data;
        
    } catch (error) {
        if( isAxiosError(error) ) {
            console.log(error.response?.data);
        }

        throw new Error(`Error al actualizar el producto`);

    }
}