import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CubeAvatarProps {
  size?: number;
  isSpeaking?: boolean;
}

// 卡通正方体小人组件
export function CubeAvatar({ size = 48, isSpeaking = false }: CubeAvatarProps) {
  const innerSize = size * 0.75;
  const eyeSize = size * 0.08;
  const mouthWidth = size * 0.15;
  const mouthHeight = size * 0.06;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 外层发光效果 */}
      <View style={[
        styles.glowOuter,
        {
          width: size,
          height: size,
          borderRadius: size * 0.25,
          backgroundColor: isSpeaking ? 'rgba(108, 99, 255, 0.3)' : 'transparent',
        }
      ]} />

      {/* 正方体主体 */}
      <View style={[
        styles.cubeBody,
        {
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize * 0.2,
          backgroundColor: '#6C63FF',
        }
      ]}>
        {/* 高光 */}
        <View style={[
          styles.highlight,
          {
            width: innerSize * 0.4,
            height: innerSize * 0.15,
            borderRadius: innerSize * 0.1,
            top: innerSize * 0.1,
            left: innerSize * 0.1,
          }
        ]} />

        {/* 左眼 */}
        <View style={[
          styles.eye,
          {
            width: eyeSize,
            height: eyeSize,
            borderRadius: eyeSize,
            backgroundColor: '#FFFFFF',
            left: innerSize * 0.25,
            top: innerSize * 0.35,
          }
        ]}>
          <View style={[
            styles.pupil,
            {
              width: eyeSize * 0.5,
              height: eyeSize * 0.5,
              borderRadius: eyeSize * 0.25,
              backgroundColor: '#2D3436',
            }
          ]} />
        </View>

        {/* 右眼 */}
        <View style={[
          styles.eye,
          {
            width: eyeSize,
            height: eyeSize,
            borderRadius: eyeSize,
            backgroundColor: '#FFFFFF',
            right: innerSize * 0.25,
            top: innerSize * 0.35,
          }
        ]}>
          <View style={[
            styles.pupil,
            {
              width: eyeSize * 0.5,
              height: eyeSize * 0.5,
              borderRadius: eyeSize * 0.25,
              backgroundColor: '#2D3436',
            }
          ]} />
        </View>

        {/* 嘴巴 - 微笑 */}
        <View style={[
          styles.mouth,
          {
            width: mouthWidth,
            height: mouthHeight,
            borderRadius: mouthHeight,
            borderBottomWidth: 2,
            borderBottomColor: '#FFFFFF',
            bottom: innerSize * 0.2,
          }
        ]} />

        {/* 腮红左 */}
        <View style={[
          styles.blush,
          {
            width: size * 0.06,
            height: size * 0.04,
            borderRadius: size * 0.02,
            backgroundColor: 'rgba(255, 101, 132, 0.5)',
            left: innerSize * 0.12,
            bottom: innerSize * 0.32,
          }
        ]} />

        {/* 腮红右 */}
        <View style={[
          styles.blush,
          {
            width: size * 0.06,
            height: size * 0.04,
            borderRadius: size * 0.02,
            backgroundColor: 'rgba(255, 101, 132, 0.5)',
            right: innerSize * 0.12,
            bottom: innerSize * 0.32,
          }
        ]} />
      </View>

      {/* 说话时的动画圆点 */}
      {isSpeaking && (
        <View style={[styles.speakingDots, { bottom: -size * 0.15 }]}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      )}
    </View>
  );
}

// 大尺寸头像（用于顶部）
export function BigCubeAvatar({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <View style={styles.bigAvatarContainer}>
      <CubeAvatar size={56} isSpeaking={isSpeaking} />
      {/* 名字标签 */}
      <View style={styles.nameTag}>
        <Text style={styles.nameText}>小方</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowOuter: {
    position: 'absolute',
  },
  cubeBody: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  eye: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupil: {
    position: 'absolute',
  },
  mouth: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  blush: {
    position: 'absolute',
  },
  speakingDots: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6C63FF',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  bigAvatarContainer: {
    alignItems: 'center',
  },
  nameTag: {
    marginTop: 4,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  nameText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
