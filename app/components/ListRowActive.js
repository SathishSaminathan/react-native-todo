import React, { Component } from 'react';
import { View, TextInput, Image, StyleSheet, Animated } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';

const ANIMATION_DURATION = 250;
const ROW_HEIGHT = 70;

class ListRowActive extends Component {
  constructor(props) {
    super(props);

    this._animated = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this._animated, {
      toValue: 1,
      duration: ANIMATION_DURATION,
    }).start();
  }

  onRemove = (index) => {
    const { deleteActiveTodo } = this.props;
    if (deleteActiveTodo) {
      Animated.timing(this._animated, {
        toValue: 0,
        duration: ANIMATION_DURATION,
      }).start(() => deleteActiveTodo(index));
    }
  };

  render() {
    const {todo, editModeIndex, index} = this.props;
    const {text, isChecked} = todo;

    const {completeTodo, onTodoEdited, turnOnEditMode, deleteActiveTodo} = this.props;

    const rowStyles = [
      styles.row,
      {
        height: this._animated.interpolate({
          inputRange: [0, 1],
          outputRange: [0, ROW_HEIGHT],
          extrapolate: 'clamp',
        }),
      },
      { opacity: this._animated },
      {
        transform: [
          { scale: this._animated },
          {
            rotate: this._animated.interpolate({
              inputRange: [0, 1],
              outputRange: ['35deg', '0deg'],
              extrapolate: 'clamp',
            })
          }
        ],
      },
    ];

    return (
      <Animated.View style={rowStyles} key={todo.id} >
          <CheckBox
            style={styles.checkbox}
            checked={isChecked}
            onPress={() => {
              completeTodo(index);
              this.onRemove(index);
            }}
          />
          <TextInput
             style={styles.text}
             defaultValue={text}
             editable={editModeIndex.index == index}
             onSubmitEditing={(event) => onTodoEdited(event.nativeEvent.text, index)}
           />
          <View style={styles.actions} >
            <Icon
              style={styles.icon}
              name="pencil"
              size={16}
              onPress={() => turnOnEditMode(index)}
            />
            <Icon
               style={styles.icon}
               name="minus-circle" size={16}
               onPress={() => this.onRemove(index)}
             />
          </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'whitesmoke',
    padding: 15,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ROW_HEIGHT,
  },
  checkbox: {
    marginLeft: 5,
  },
  text: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  actions: {
    flexDirection: 'row',
  },
  icon: {
    padding: 5,
  }
});


export default ListRowActive;