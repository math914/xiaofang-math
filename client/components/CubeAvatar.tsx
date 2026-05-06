import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CubeAvatarProps {
  size?: number;
  isSpeaking?: boolean;
}

// 卡通黄色正方体小人组件 - 小方
export function CubeAvatar({ size = 48, isSpeaking = false }: CubeAvatarProps) {
  const innerSize = size * 0.8;
  const eyeSize = size * 0.12;
  const pupilSize = eyeSize * 0.6;
  const mouthWidth = size * 0.2;
  const mouthHeight = size * 0.12;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 外层光晕（说话时发光） */}
      {isSpeaking && (
        <View style={[
          styles.glowRing,
          { width: size * 1.3, height: size * 1.3, borderRadius: size * 0.65 }
        ]} />
      )}

      {/* 正方体主体 - 圆润的黄色身体 */}
      <View style={[
        styles.cubeBody,
        {
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize * 0.25,
          backgroundColor: '#FFD93D',
        }
      ]}>
        {/* 顶部头发装饰 - 几根呆毛 */}
        <View style={[styles.hair1, { left: innerSize * 0.3, top: -innerSize * 0.05 }]} />
        <View style={[styles.hair2, { left: innerSize * 0.45, top: -innerSize * 0.08 }]} />
        <View style={[styles.hair3, { left: innerSize * 0.6, top: -innerSize * 0.03 }]} />

        {/* 顶部高光（圆弧形） */}
        <View style={[
          styles.topHighlight,
          {
            width: innerSize * 0.5,
            height: innerSize * 0.18,
            borderRadius: innerSize * 0.1,
            top: innerSize * 0.08,
            left: innerSize * 0.15,
          }
        ]} />

        {/* 左眼 - 大眼睛 */}
        <View style={[
          styles.eyeWhite,
          {
            width: eyeSize,
            height: eyeSize * 1.2,
            borderRadius: eyeSize * 0.6,
            left: innerSize * 0.2,
            top: innerSize * 0.32,
          }
        ]}>
          {/* 瞳孔 */}
          <View style={[
            styles.pupil,
            {
              width: pupilSize,
              height: pupilSize * 1.1,
              borderRadius: pupilSize * 0.55,
              backgroundColor: '#2D3436',
            }
          ]} />
          {/* 眼神光 */}
          <View style={[
            styles.eyeShine,
            { width: pupilSize * 0.35, height: pupilSize * 0.35, borderRadius: pupilSize * 0.175 }
          ]} />
        </View>

        {/* 右眼 - 大眼睛 */}
        <View style={[
          styles.eyeWhite,
          {
            width: eyeSize,
            height: eyeSize * 1.2,
            borderRadius: eyeSize * 0.6,
            right: innerSize * 0.2,
            top: innerSize * 0.32,
          }
        ]}>
          {/* 瞳孔 */}
          <View style={[
            styles.pupil,
            {
              width: pupilSize,
              height: pupilSize * 1.1,
              borderRadius: pupilSize * 0.55,
              backgroundColor: '#2D3436',
            }
          ]} />
          {/* 眼神光 */}
          <View style={[
            styles.eyeShine,
            { width: pupilSize * 0.35, height: pupilSize * 0.35, borderRadius: pupilSize * 0.175 }
          ]} />
        </View>

        {/* 嘴巴 - 可爱的W形状微笑 */}
        <View style={[
          styles.mouth,
          {
            width: mouthWidth,
            height: mouthHeight,
            bottom: innerSize * 0.18,
          }
        ]}>
          {/* 左半边弧 */}
          <View style={[styles.mouthArc, styles.mouthLeft]} />
          {/* 右半边弧 */}
          <View style={[styles.mouthArc, styles.mouthRight]} />
          {/* 舌头 */}
          <View style={[
            styles.tongue,
            {
              width: mouthWidth * 0.35,
              height: mouthHeight * 0.5,
              borderRadius: mouthHeight * 0.25,
              bottom: -mouthHeight * 0.1,
            }
          ]} />
        </View>

        {/* 腮红左 - 粉粉的 */}
        <View style={[
          styles.blush,
          {
            width: size * 0.08,
            height: size * 0.05,
            borderRadius: size * 0.04,
            backgroundColor: '#FFB6C1',
            left: innerSize * 0.08,
            bottom: innerSize * 0.28,
          }
        ]} />

        {/* 腮红右 */}
        <View style={[
          styles.blush,
          {
            width: size * 0.08,
            height: size * 0.05,
            borderRadius: size * 0.04,
            backgroundColor: '#FFB6C1',
            right: innerSize * 0.08,
            bottom: innerSize * 0.28,
          }
        ]} />
      </View>

      {/* 底部阴影 */}
      <View style={[
        styles.shadow,
        {
          width: innerSize * 0.7,
          height: innerSize * 0.1,
          borderRadius: innerSize * 0.05,
          bottom: -innerSize * 0.05,
        }
      ]} />

      {/* 说话时的动画圆点 */}
      {isSpeaking && (
        <View style={[styles.speakingDots, { bottom: -size * 0.12 }]}>
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
      <CubeAvatar size={64} isSpeaking={isSpeaking} />
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
  glowRing: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 217, 61, 0.3)',
  },
  cubeBody: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E6B800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
    overflow: 'visible',
  },
  // 呆毛头发
  hair1: {
    position: 'absolute',
    width: 4,
    height: 10,
    backgroundColor: '#8B7355',
    borderRadius: 2,
    transform: [{ rotate: '-15deg' }],
  },
  hair2: {
    position: 'absolute',
    width: 4,
    height: 14,
    backgroundColor: '#8B7355',
    borderRadius: 2,
    transform: [{ rotate: '5deg' }],
  },
  hair3: {
    position: 'absolute',
    width: 4,
    height: 8,
    backgroundColor: '#8B7355',
    borderRadius: 2,
    transform: [{ rotate: '20deg' }],
  },
  topHighlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  eyeWhite: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pupil: {
    position: 'absolute',
  },
  eyeShine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    top: 2,
    right: 2,
  },
  mouth: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  mouthArc: {
    width: 12,
    height: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#FF6B6B',
    borderRadius: 0,
  },
  mouthLeft: {
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
    marginRight: -2,
  },
  mouthRight: {
    borderRightWidth: 3,
    borderRightColor: '#FF6B6B',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 0,
    marginLeft: -2,
  },
  tongue: {
    position: 'absolute',
    backgroundColor: '#FF9999',
  },
  blush: {
    position: 'absolute',
  },
  shadow: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  speakingDots: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFD93D',
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
    marginTop: 6,
    backgroundColor: 'rgba(255, 217, 61, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 217, 61, 0.5)',
  },
  nameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B8860B',
    letterSpacing: 1,
  },
});
