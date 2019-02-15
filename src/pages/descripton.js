import React, { Component } from 'react'
import { ScrollView, Image, Dimensions, Text, ImageStore, ImageEditor, AsyncStorage, Alert } from 'react-native'
import { Button } from 'react-native-elements';
const SCREEN_WIDTH = Dimensions.get('screen').width

// const SCREEN_HEIGHT = Dimensions.get('screen').height

export default class Description extends Component {
    static navigationOptions = {
        title: 'Description'
    }

    constructor(props) {
        super(props);

        this.state = {
            pictureBase64: null,
            button: true,
            loading: false,
          }  
    }
   
      
    buttonLoad(hero) {
        AsyncStorage.getItem('ID' + hero.id, (err, result) => {
            // alert(JSON.parse(result))
            if (result != null) {
                const storage = JSON.parse(result);
                if (storage.id == hero.id) {
                    this.setState({button: false});
                } else {
                    this.setState({button: true});
                }
            }  else {
                this.setState({button: true});
            }       
        });
        //Verifica se já favoritou o item
        // alert(this.state.button)
        if (this.state.button == true) {
            return(<Button 
                        onPress={()=>this.favorites(hero)}
                        title="Favorites"
                        // buttonStyle={{backgroundColor: "#841584"}}
                        loading={this.state.loading}
                        accessibilityLabel="Learn more about this purple button"
                        />);
        } else {
            return(<Button 
                    onPress={()=>this.delfavorites(hero.id)}
                    title="Remove Favorites"
                    buttonStyle={{backgroundColor: "#000"}}
                    loading={this.state.loading}
                    accessibilityLabel="Learn more about this purple button"
                    />);
        }
    }

    delfavorites = (id) => {
        this.setState({loading:true});
        AsyncStorage.removeItem('ID' + id);
        this.setState({button: true, loading:false});
        Alert.alert('Favorites', 'Removed Success');
        // this.props.navigation.goBack(null);
        this.props.navigation.navigate('Favoritos', {token: '2321'});
        // return true;


    }

    favorites = (dados) => {
        this.setState({loading:true});
        url = `${dados.thumbnail.path}.${dados.thumbnail.extension}`;
        // url = url.replace('http', 'file');
        const imageURL = url;
        Image.getSize(imageURL, (width, height) => {
        const imageSize = {
            size: {
            width,
            height
            },
            offset: {
            x: 0,
            y: 0,
            }
        };
        ImageEditor.cropImage(imageURL, imageSize, (imageURI) => {
            // console.log(imageURI);
            ImageStore.getBase64ForTag(imageURI, (base64Data) => {
            //SALVA IMG EM BASE64
            this.setState({ pictureBase64: `data:image/jpg;base64,${base64Data}` });
            // alert(this.state.pictureBase64);
            let DBfavorites = {
                id: dados.id,
                title: dados.title,
                dates: dados.dates,
                description: dados.description,
                prices: dados.prices,
                characters: dados.characters,
                creators: dados.creators,
                image: this.state.pictureBase64
            }
            // JSON.stringify()
            AsyncStorage.setItem('ID' + dados.id, JSON.stringify(DBfavorites))
            this.setState({ button: false, loading:false});
            Alert.alert('Favorites', 'Added Successfully!')
            this.props.navigation.navigate('Favoritos', {token: '2321'});
            // ImageStore.removeImageForTag(imageURI);  
            }, (reason) => console.log(reason))
        }, (reason) => console.log(reason))
        }, (reason) => console.log(reason))
    }

    characters(info) {
        if (info.returned == 0) {      
            return (<Text style={{padding:10}}>
                        <Text style={{fontWeight: 'bold'}}>Characters: </Text>
                        <Text>NOT FOUND</Text>
                    </Text>)
        } else {
            Characters = "";
            info.items.map((item) => { 
                Characters += item.name + ", ";
            })
            Characters = Characters.substr(0, Characters.length-2);
            return (<Text style={{padding:10}}>
                        <Text style={{fontWeight: 'bold'}}>Characters: </Text>
                        <Text>{Characters}</Text>
                    </Text>)
        }
    }

    creators(info) {
        if (info.returned == 0) {      
            return (<Text style={{padding:10}}>
                <Text style={{fontWeight: 'bold'}}>Creators: </Text>
                <Text>NOT FOUND</Text>
            </Text>)
        } else {
            Creators = '';
            info.items.map((item) => { 
                Creators += item.name + "(" + item.role + ")" + ", ";
            })
            Creators = Creators.substr(0, Creators.length-2);
            return (<Text style={{padding:10}}>
                        <Text style={{fontWeight: 'bold'}}>Creators: </Text>
                        <Text>{Creators}</Text>
                    </Text>)
        }
    }

    render() {
        if (typeof this.props.navigation.state.params == "undefined") {
            return (<Text style={{padding:10, fontWeight: 'bold'}}>Select a comic</Text>)
        }
        const { hero } = this.props.navigation.state.params;
         

        hero.dates.filter(item => {
            // alert(item.type)
            if (item.type == 'focDate') {
                dateFoc = item.date.substr(0, 10);
            }
        });
        // alert(hero.thumbnail.path)

        if (typeof hero.thumbnail == 'undefined') {
            img = hero.image;
        } else {
            img = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;
        }

        // alert(img)
        return (
           <ScrollView key={hero.id}>
               <Image 
                    source={{uri: img}} 
                    style={{
                        flex: 1,
                        width: SCREEN_WIDTH,
                        height: SCREEN_WIDTH,
                        resizeMode: 'contain' }}
                />
               <Text style={{padding:10, fontSize:20, fontWeight: 'bold'}}>{hero.title}</Text>               
                {this.buttonLoad(hero)}
                <Text style={{padding:10}}>
                    <Text style={{fontWeight: 'bold'}}>Date Publish: </Text>
                    <Text>{dateFoc}</Text>
                </Text>
                <Text style={{padding:10, fontWeight: 'bold'}}>Edition Description: </Text>
                <Text style={{padding:10}}>{hero.description == null ? "Not Found" : hero.description}</Text>
                {hero.prices.map((item) => {
                    if (item.type == 'printPrice') {
                        tipo = 'Price';
                    } else if (item.type == 'digitalPurchasePrice') {
                        tipo = 'Digital Purchase Price';
                    }
                    return (<Text style={{padding:10}}>
                                <Text style={{fontWeight: 'bold'}}>{tipo}: </Text>
                                <Text>${item.price}</Text>
                            </Text>)
                })}
                {this.characters(hero.characters)}
                {this.creators(hero.creators)}
           </ScrollView> 
        )
    }
}