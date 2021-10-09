import * as React from 'react'
import {Button, Image, View, Platform} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class PickImage extends React.Component{

    state = {
        image: null,

    }
    getPermissionsAsync=async()=>{
        if(Platform.OS !== 'web'){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== 'granted'){
                alert('Sorry, we need camera roll permissions to run the app')
            }
        }
    }
    pickImage=async()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1
            })
            if(! result.cancelled){
                this.setState({
                    image: result.data
                })
                this.uploadImage(result.uri)
            }
        }
        catch(E){
            console.log(E)
        }
    }
    uploadImage=async(uri)=>{
        const data = new FormData()
        let fileName = uri.split('/')[uri.split('/').length-1]
        let type = `image/${uri.split('.')[uri.split('.').length-1]}`
        const fileToUpload = {
            uri: uri,
            name: fileName,
            type: type
        }
        data.append('digit', fileToUpload)
        fetch('http://3970-73-83-157-4.ngrok.io/predict-digit', {
            method: 'POST',
            body: data,
            headers: {
                "content-type": "multipart/form-data"
            }
        }).then((response)=>
            response.json()
        ).then((result)=>{
            console.log("Success : ", result)
        }).catch((error)=>{
            console.log(error)
        })

    }
    componentDidMount(){
        this.getPermissionsAsync()
    }
    render(){
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Button 
                title = 'Pick an image from Camera Roll'
                onPress={this.pickImage}
                />

            </View>
        )
    }
}