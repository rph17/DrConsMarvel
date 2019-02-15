import React from 'react'
import { TouchableOpacity, Dimensions, View, FlatList, Text, Image, ActivityIndicator, AsyncStorage, Picker   } from 'react-native'
// import md5 from 'js-md5'
import { TextInput } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-elements';
const SCREEN_WIDTH = Dimensions.get('screen').width


export default class Home extends React.PureComponent {
    static navigationOptions = {
        title: 'Favorites'
    }
    
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            search: null,
            data: [],
            error: null,
            option: null,
        }       
        
        this.arrayResults = [];
    }
    
    componentWillReceiveProps(nextProps) {
      if (nextProps.navigation.state.params.token) {
        this.storageDados();
      }
    }
    
    async componentDidMount() {
        this.storageDados();
    }

    storageDados = () => {
      const arrayCarregado = [];
        this.setState({ loading: true });
        //BUSCA OS DADOS NO BANCO DE DADOS
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
              stores = stores.sort();
              stores.map((result, i, store) => {
                // get at each store's key/value so you can work with it
                let key = store[i][0];
                let value = store[i][1];
                let results = JSON.parse(value);

                // alert(store[i][1])
                arrayCarregado.push(results);
                // alert(value)

              });
              //Coloca em ordem
              arrayCarregado.sort((a,b) => {
                  if(a.title < b.title) { return -1; }
                  if(a.title > b.title) { return 1; }
                  return 0;
              });

              this.setState({data: arrayCarregado, loading:false})
              this.arrayResults = arrayCarregado;

            });
          });

        // this.setState({data: responseJson.data.results, loading:false})
        // this.arrayResults = responseJson.data.results;
    }

    dateFormat = (dt) => {
        // alert(dt)
        dt.filter(item => {
            if (item.type == 'focDate') {
                dateFoc = item.date.substr(0, 10);
            }
        });
        var date = dateFoc;
        return date;
    }

    renderItem = ({item}) => {  
        return  (
            <TouchableOpacity onPress={()=>this.onItemPress(item)} style={{flexDirection:'row', padding: 10, alignItems:'center'}}>
                <Image style={{height: 50, width: 50, borderRadius: 25}} source={{uri: item.image }} />
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

    renderTable = (opt) => {
      return this.arrayResults.sort((a,b) => {
        if (opt == 'date') {
          return new Date(this.dateFormat(a.dates))  - new Date(this.dateFormat(b.dates))
        } else {
          if(a.title < b.title) { return -1; }
          if(a.title > b.title) { return 1; }
          return 0;
        }
      });
    }


    readerHeader = () => {
      const { search } = this.state;

        return (<View>
                    {/* <TextInput
                    placeholder="Search..."
                    onChangeText={this.searchItem}
                    ></TextInput> */}
                  <SearchBar
                    placeholder="Search..."
                    onChangeText={this.searchItem}
                    value={search}
                  />
                  {/* <View style={{flex:1, flexDirection: 'row', padding:10}}> */}
                    {/* <Text>Filter:</Text> */}
                    <Picker
                        placeholder="Filter"
                        mode="dropdown"
                        selectedValue={this.state.option}
                        style={{width: SCREEN_WIDTH}}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({option: itemValue, data : this.renderTable(itemValue) })
                        }>
                        <Picker.Item label="Filter..." value="" />
                        <Picker.Item label="Name" value="name" />
                        <Picker.Item label="Date" value="date" />
                      </Picker>
                      {/* </View> */}
                </View>);
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
          if (this.state.loading == false && this.state.data == "") {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{padding:10, fontWeight: 'bold'}}>There are no comics in the favorites</Text>
              </View>
            );
          } else if (this.state.loading) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            );
          } else {
            return (
                <FlatList 
                    data={this.state.data}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.readerHeader}
                />
            )
          }
        
    }
}