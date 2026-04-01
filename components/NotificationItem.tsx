import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'order' | 'promo' | 'system';
  read: boolean;
}

interface NotificationItemProps {
  item: Notification;
  onDelete: (id: string) => void;
  onPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function NotificationItem({ item, onDelete, onPress }: NotificationItemProps) {
  const [swipeableRef, setSwipeableRef] = useState<Swipeable | null>(null);

  const renderRightAction = (text: string, icon: string, color: string, progress: Animated.AnimatedInterpolation<number>) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [SCREEN_WIDTH, 0],
    });

    return (
      <Animated.View style={{ transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.deleteButton, { backgroundColor: color }]}
          onPress={() => {
            onDelete(item.id);
            swipeableRef?.close();
          }}
        >
          <Ionicons name={icon as any} size={24} color="#fff" />
          <Text style={styles.deleteText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, _dragX: Animated.AnimatedInterpolation<number>) => (
    <View style={styles.deleteContainer}>
      {renderRightAction('Delete', 'trash', '#FF3B30', progress)}
    </View>
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return 'bag';
      case 'promo':
        return 'pricetag';
      case 'system':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  return (
    <Swipeable
      ref={(ref) => setSwipeableRef(ref)}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
    >
      <TouchableOpacity 
        style={[styles.notification, !item.read && styles.unread]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={24}
            color={item.type === 'order' ? '#007AFF' : item.type === 'promo' ? '#FF9500' : '#34C759'}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString()} at{' '}
            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.25,
    height: '100%',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  notification: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  unread: {
    backgroundColor: '#f0f7ff',
    borderColor: '#007AFF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
    marginTop: 8,
  },
});
