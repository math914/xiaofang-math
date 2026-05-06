import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import RNSSE from 'react-native-sse';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// 初始欢迎消息
const WELCOME_MESSAGE = `嗨~ 我是小方！欢迎来到立方王国！

今天我们一起来探索一个有趣的数学问题：

想象有一个魔方，它的表面涂满了漂亮的红色。如果我把这个魔方切成若干个小正方体，你会发现这些小正方体身上的红色是不一样的哦！

你能猜猜看，切开后的这些小正方体，可能有几种不同的涂色情况呢？

（提示：从"完全没有红色"到"三面都是红色"都有可能哦~）`;

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: WELCOME_MESSAGE,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'http://localhost:9091';
  const sseRef = useRef<RNSSE | null>(null);

  // 清理 SSE 连接
  useEffect(() => {
    return () => {
      if (sseRef.current) {
        sseRef.current.close();
      }
    };
  }, []);

  // 滚动到底部
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // 发送消息
  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    // 添加用户消息
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    scrollToBottom();

    // 添加空消息用于流式内容
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      // 构造历史消息
      const historyMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // 关闭之前的连接
      if (sseRef.current) {
        sseRef.current.close();
      }

      let fullContent = '';

      // 使用 RNSSE 进行 SSE 流式请求
      sseRef.current = new RNSSE(`${backendUrl}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...historyMessages, { role: 'user', content: userMessage }],
        }),
      });

      sseRef.current.addEventListener('message', (event) => {
        if (event.data === '[DONE]') {
          setIsLoading(false);
          return;
        }

        try {
          const data = event.data || '';
          const parsed = JSON.parse(data);
          if (parsed.content) {
            fullContent += parsed.content;
            // 更新最后一条消息
            setMessages((prev) => {
              const updated = [...prev];
              if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
                updated[updated.length - 1].content = fullContent;
              }
              return updated;
            });
          }
        } catch (e) {
          // 忽略解析错误
        }
      });

      sseRef.current.addEventListener('error', (event) => {
        console.error('SSE error:', event);
        setIsLoading(false);
        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
            if (!updated[updated.length - 1].content) {
              updated[updated.length - 1].content = '抱歉，网络出问题了~ 请稍后重试哦！';
            }
          }
          return updated;
        });
      });

      scrollToBottom();
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
          updated[updated.length - 1].content = '抱歉，网络出问题了~ 请稍后重试哦！';
        }
        return updated;
      });
      scrollToBottom();
    }
  };

  return (
    <Screen style={styles.container}>
      {/* 顶部区域 */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#6C63FF', '#896BFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>方</Text>
              </View>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>小方老师</Text>
              <Text style={styles.headerSubtitle}>立方王国 · 六年级数学</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* 聊天区域 */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageWrapper,
                msg.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
              ]}
            >
              {msg.role === 'assistant' && (
                <View style={styles.assistantAvatar}>
                  <View style={styles.smallAvatar}>
                    <Text style={styles.smallAvatarText}>方</Text>
                  </View>
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
                  ]}
                >
                  {msg.content || (isLoading && index === messages.length - 1 ? '思考中...' : '')}
                </Text>
              </View>
            </View>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <View style={[styles.messageWrapper, styles.assistantMessageWrapper]}>
              <View style={styles.assistantAvatar}>
                <View style={styles.smallAvatar}>
                  <Text style={styles.smallAvatarText}>方</Text>
                </View>
              </View>
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <ActivityIndicator size="small" color="#6C63FF" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* 输入区域 */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="输入你的回答..."
              placeholderTextColor="#B2BEC3"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
            >
              <LinearGradient
                colors={inputText.trim() ? ['#6C63FF', '#896BFF'] : ['#D1D9E6', '#B2BEC3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButtonGradient}
              >
                <Text style={styles.sendButtonText}>发送</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F3',
  },
  header: {
    height: 140,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6C63FF',
  },
  headerTextContainer: {
    marginLeft: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  assistantMessageWrapper: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  smallAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C63FF',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#6C63FF',
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#2D3436',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F0F0F3',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#E8E8EB',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
