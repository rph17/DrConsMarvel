import React from 'react'
import { TouchableOpacity, View, FlatList, Text, Image, ActivityIndicator, AsyncStorage, NetInfo } from 'react-native'
import md5 from 'js-md5'
import { TextInput } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-elements';


const PUBLIC_KEY = 'ad3c8d04e71b83f913f7efba8817d9c9'
const PRIVATE_KEY = 'e9873045e7659b06b3f05e1104580727555851c8'

export default class Home extends React.PureComponent {
    static navigationOptions = {
        // header: null,
        title: 'Comics'
    }
    
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            search: null,
            data: [],
            error: null,
            isConnected: null,
        }

        // AsyncStorage.getAllKeys((err, keys) => {
        //     AsyncStorage.multiGet(keys, (err, stores) => {
        //       stores.map((result, i, store) => {
        //         // get at each store's key/value so you can work with it
        //         let key = store[i][0];
        //         let value = store[i][1];
        //         alert(key)
        //       });
        //     });
        //   });
        
        this.arrayResults = [];
    }
    
    
    async componentDidMount() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            // alert(connectionInfo.type);
            this.setState({isConnected: connectionInfo.type !== 'none'})
        })
        const timestamp = Number(new Date()) //coverte a data para timestamp
        const hash = md5.create() // cria o hash 
        hash.update(timestamp + PRIVATE_KEY + PUBLIC_KEY)
        this.setState({ loading: true });

        const response = await fetch(`https://gateway.marvel.com/v1/public/comics?ts=${timestamp}&orderBy=title&limit=50&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`)
        const responseJson = await response.json()
        // alert(responseJson.data.results)
        this.setState({data: responseJson.data.results, loading:false})
        this.arrayResults = responseJson.data.results;
    }

    dateFormat = (dt) => {
        dt.filter(item => {
            if (item.type == 'focDate') {
                dateFoc = item.date.substr(0, 10);
            }
        });
        var date = dateFoc;
        return date;
    }

    renderItem = ({item}) => {  
        // alert(item.title)      
        return  (
            <TouchableOpacity onPress={()=>this.onItemPress(item)} style={{flexDirection:'row', padding: 10, alignItems:'center'}}>
                <Image style={{height: 50, width: 50, borderRadius: 25}} source={{uri: `${item.thumbnail.path}.${item.thumbnail.extension}` }} />
                <Text style={{marginLeft: 10}}>{item.title} - {this.dateFormat(item.dates)}</Text>
            </TouchableOpacity>
        )
    }

    onItemPress = (item) => {
        this.props.navigation.navigate('Description', {hero: item})
    } 

    searchItem = (search) => {
        const newData = this.arrayResults.filter(item => {
            const searchData = search.toUpperCase();
            const itemData = item.title.toUpperCase();
            return itemData.indexOf(searchData) > -1;
        })
        this.setState({data: newData});
    }

    readerHeader = () => {
        // return (<View>
        //             <TextInput
        //             placeholder="Search..."
        //             onChangeText={this.searchItem}
        //             ></TextInput>
        //         </View>);
        const { search } = this.state;
        return (
            <SearchBar
              placeholder="Search..."
              onChangeText={this.searchItem}
              value={search}
            />
          );
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: '#000',
              marginLeft: '14%',
            }}
          />
        );
      }

    render() {
        // alert(this.state.isConnected)
        if (this.state.isConnected == false) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{padding:10, fontWeight: 'bold'}}>There is no internet connection.</Text>
                  <Text style={{padding:10, fontWeight: 'bold'}}> You can see your favorite comics</Text>
                </View>
              );
        } else if (this.state.loading) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            );
          } else {
            //   alert(this.state.data)
            return (
                <FlatList 
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.readerHeader}
                />
            )
          }
        
    }
}