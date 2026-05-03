'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'ko' | 'en'

interface I18nContextProps {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string, variables?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined)

const dictionaries: Record<Language, Record<string, string>> = {
    ko: {
        'brand.subtitle': '내 옷장 기반 AI 코디 추천',

        'landing.hero': '매일 아침 고민 끝.',
        'landing.heroSub': '날씨와 내 옷장을 분석해 딱 맞는 코디를 추천해드려요.',
        'landing.feat1Title': '☁️ 날씨 연동 코디',
        'landing.feat1Desc': '오늘 기온·날씨에 맞는 옷을 자동으로 골라줘요.',
        'landing.feat2Title': '🤖 AI 분석',
        'landing.feat2Desc': '사진 한 장이면 AI가 옷 정보를 자동으로 태깅해요.',
        'landing.feat3Title': '👗 내 옷장 관리',
        'landing.feat3Desc': '가진 옷들을 디지털 옷장에 모아두고 쉽게 관리해요.',
        'landing.feat4Title': '✨ 스타일 히스토리',
        'landing.feat4Desc': '마음에 든 코디를 찜하고 나만의 스타일 북을 만들어요.',
        'landing.cta': '지금 무료로 시작하기',
        'auth.email': '이메일',
        'auth.password': '비밀번호',
        'auth.login': '로그인',
        'auth.signup': '회원가입',
        'auth.processing': '처리 중...',
        'auth.noAccount': '계정이 없으신가요? 회원가입',
        'auth.hasAccount': '이미 계정이 있으신가요? 로그인',
        'auth.pwHint': '대문자·소문자·숫자·특수문자 포함 8자 이상',
        'auth.forgotPassword': '비밀번호를 잊으셨나요?',
        'auth.sendResetLink': '재설정 링크 전송',
        'auth.resetEmailSent': '비밀번호 재설정 이메일이 발송되었습니다.',
        'auth.backToLogin': '로그인으로 돌아가기',
        'auth.updatePasswordTitle': '새 비밀번호 설정',
        'auth.newPassword': '새 비밀번호',
        'auth.updatePasswordBtn': '비밀번호 변경',
        'auth.passwordUpdated': '비밀번호가 성공적으로 변경되었습니다.',

        'auth.gender': '성별',
        'auth.male': '남성',
        'auth.female': '여성',
        'auth.ageGroup': '연령대',
        'auth.preferredStyles': '선호하는 스타일',
        'auth.multipleChoices': '(중복 선택 가능)',
        'auth.onboardingError': '성별, 연령대, 선호 스타일을 모두 선택해주세요.',
        'auth.continueWithGoogle': 'Google로 계속하기',
        'auth.continueWithKakao': '카카오톡으로 계속하기',
        'auth.agreeToTerms': '가입 시 아래 약관에 동의합니다:',
        'auth.termsLink': '이용약관 및 개인정보 처리방침',
        'auth.termsRequired': '이용약관에 동의해주세요.',

        'onboarding.title': '환영합니다! 취향을 알려주세요',
        'onboarding.desc': 'AI가 나한테 딱 맞는 맞춤 코디를 추천해 주기 위해 필요한 정보입니다.',

        'style.casual': '캐주얼',
        'style.minimal': '미니멀',
        'style.street': '스트릿',
        'style.dandy': '댄디',
        'style.classic': '클래식',
        'style.office': '오피스룩',
        'style.sports': '스포츠 / 애슬레저',
        'style.vintage': '빈티지',
        'style.hiphop': '힙합',
        'style.modern': '모던',
        'style.lovely': '러블리',
        'style.highend': '하이엔드',

        'age.10-20': '10-20대',
        'age.20-30': '20-30대',
        'age.30-40': '30-40대',
        'age.40-50': '40-50대',
        'age.50-60': '50-60대',
        'age.60+': '60대 이상',

        'nav.home': '홈',
        'nav.wardrobe': '옷장',
        'nav.recommend': '추천',
        'nav.history': '내 스타일',

        'home.weatherTitle': '오늘의 날씨',
        'home.weatherDesc': '날씨 기반으로 코디를 추천해드려요',
        'home.recHint': '상의와 하의를 각각 1개 이상 등록하면\n코디 추천을 받을 수 있어요!',
        'home.addFirst': '첫 번째 옷 추가하기',

        'common.add': '추가',
        'common.all': '전체',
        'common.save': '저장',
        'common.cancel': '취소',
        'common.edit': '수정',
        'common.delete': '삭제',
        'common.confirmDelete': '정말 삭제할까요?',
        'common.error': '오류가 발생했습니다.',
        'common.empty': '데이터가 없습니다.',

        'wardrobe.title': '내 옷장',
        'wardrobe.upwear': '상의',
        'wardrobe.downwear': '하의',
        'wardrobe.onepiece': '원피스',
        'wardrobe.emptyTitle': '아직 등록된 옷이 없어요.',
        'wardrobe.emptyDesc': '옷장 관리를 시작해보세요.',
        'wardrobe.addTitle': '새 옷 추가',
        'wardrobe.addDesc': '사진을 올리면 AI가 정보를 분석해줘요',
        'wardrobe.uploadHint1': '클릭하거나 사진을 끌어다 놓으세요',
        'wardrobe.uploadHint2': 'JPG, PNG, WEBP 지원',
        'wardrobe.analyzeStart': 'AI로 분석하기',
        'wardrobe.analyzing': 'AI 분석 중...',
        'wardrobe.resultTitle': '분석 결과 (수정 가능)',
        'wardrobe.labelName': '옷 이름',
        'wardrobe.labelLocation': '위치 (예: 첫번째 서랍, 2번째 방 옷장)',
        'wardrobe.labelCategory': '카테고리',
        'wardrobe.labelStyle': '스타일',
        'wardrobe.labelSeasons': '계절 (복수 선택)',
        'wardrobe.labelColors': '색상 (콤마로 구분)',
        'wardrobe.saveWardrobe': '옷장에 저장하기',
        'wardrobe.notFound': '옷을 찾을 수 없어요',
        'wardrobe.back': '옷장으로 돌아가기',
        'wardrobe.infoEdit': '정보 수정',
        'wardrobe.propCategory': '카테고리',
        'wardrobe.propStyle': '스타일',
        'wardrobe.propColor': '색상',
        'wardrobe.propLocation': '위치',
        'wardrobe.propSeason': '계절',

        'recommend.title': '코디 추천',
        'recommend.desc': '오늘 날씨에 맞는 코디 3가지를 추천해드려요',
        'recommend.reqText': '상의와 하의를 각각 1개 이상 등록해주세요.',
        'recommend.weatherLoading': '날씨 정보를 불러오는 중...',
        'recommend.button': '코디 추천받기',
        'recommend.buttonAgain': '다시 추천받기',
        'recommend.loading': 'AI가 코디 추천 중...',
        'recommend.resultTitle': '추천 코디',
        'recommend.preview': '미리보기 (베타)',
        'recommend.previewLoading': 'AI가 옷을 입혀보고 있어요...',

        'history.title': '내 스타일',
        'history.desc': '내가 찜한 코디들을 모아보세요',
        'history.empty': '아직 찜한 코디가 없어요.',

        'weather.temp': '기온',
        'weather.feelsLike': '체감',
        'weather.humidity': '습도',
        'weather.loadingRetry': '날씨 정보를 불러오는 중... (다시 시도하려면 클릭)',

        'contact.developedBy': 'Developed by',
        'contact.tagline': 'AI 기반 날씨 연동 맞춤 코디 추천 앱',
        'contact.title': '문의하기',
        'contact.name': '이름',
        'contact.email': '이메일',
        'contact.message': '메시지',
        'contact.messagePlaceholder': '문의 내용을 입력해 주세요...',
        'contact.send': '보내기',
        'contact.sent': '메시지가 전송되었습니다!',
        'contact.sentDesc': '보내주신 내용을 확인 후 답변드리겠습니다.',
    },
    en: {
        'brand.subtitle': 'AI Outfit Recommendations based on your wardrobe',

        'landing.hero': 'No more morning outfit stress.',
        'landing.heroSub': 'Get AI-powered outfit recommendations based on today\'s weather and your wardrobe.',
        'landing.feat1Title': '☁️ Weather-Smart Outfits',
        'landing.feat1Desc': 'Automatically picks clothes suited to today\'s temperature and conditions.',
        'landing.feat2Title': '🤖 AI Analysis',
        'landing.feat2Desc': 'Just upload a photo — AI tags your clothing details automatically.',
        'landing.feat3Title': '👗 Digital Wardrobe',
        'landing.feat3Desc': 'Store and manage all your clothes in one place.',
        'landing.feat4Title': '✨ Style History',
        'landing.feat4Desc': 'Save favorite outfits and build your personal style book.',
        'landing.cta': 'Start for free',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.login': 'Log in',
        'auth.signup': 'Sign up',
        'auth.processing': 'Processing...',
        'auth.noAccount': "Don't have an account? Sign up",
        'auth.hasAccount': 'Already have an account? Log in',
        'auth.pwHint': 'Min 8 chars with upper, lower, number, special char',
        'auth.forgotPassword': 'Forgot Password?',
        'auth.sendResetLink': 'Send Reset Link',
        'auth.resetEmailSent': 'A password reset email has been sent.',
        'auth.backToLogin': 'Back to Login',
        'auth.updatePasswordTitle': 'Set New Password',
        'auth.newPassword': 'New Password',
        'auth.updatePasswordBtn': 'Update Password',
        'auth.passwordUpdated': 'Password has been updated successfully.',

        'auth.gender': 'Gender',
        'auth.male': 'Male',
        'auth.female': 'Female',
        'auth.ageGroup': 'Age Group',
        'auth.preferredStyles': 'Preferred Styles',
        'auth.multipleChoices': '(Multiple Choices)',
        'auth.onboardingError': 'Please select your gender, age group, and preferred styles.',
        'auth.continueWithGoogle': 'Continue with Google',
        'auth.continueWithKakao': 'Continue with Kakao',
        'auth.agreeToTerms': 'I agree to the',
        'auth.termsLink': 'Terms of Service & Privacy Policy',
        'auth.termsRequired': 'Please agree to the Terms of Service.',

        'onboarding.title': 'Welcome! Tell us about yourself',
        'onboarding.desc': 'We need some details to personalize your AI outfit recommendations.',

        'style.casual': 'Casual',
        'style.minimal': 'Minimal',
        'style.street': 'Street',
        'style.dandy': 'Dandy',
        'style.classic': 'Classic',
        'style.office': 'Office',
        'style.sports': 'Sports/Athleisure',
        'style.vintage': 'Vintage',
        'style.hiphop': 'Hip-hop',
        'style.modern': 'Modern',
        'style.lovely': 'Lovely',
        'style.highend': 'High-end',

        'age.10-20': 'Teens-20s',
        'age.20-30': '20s-30s',
        'age.30-40': '30s-40s',
        'age.40-50': '40s-50s',
        'age.50-60': '50s-60s',
        'age.60+': '60s+',

        'nav.home': 'Home',
        'nav.wardrobe': 'Wardrobe',
        'nav.recommend': 'Recommend',
        'nav.history': 'My Style',

        'home.weatherTitle': "Today's Weather",
        'home.weatherDesc': "Get outfit recommendations based on the weather",
        'home.recHint': "Register at least one top and bottom\nto get outfit recommendations!",
        'home.addFirst': "Add First Clothing Item",

        'common.add': 'Add',
        'common.all': 'All',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.edit': 'Edit',
        'common.delete': 'Delete',
        'common.confirmDelete': 'Are you sure you want to delete?',
        'common.error': 'An error occurred.',
        'common.empty': 'No data available.',

        'wardrobe.title': 'My Wardrobe',
        'wardrobe.upwear': 'Top',
        'wardrobe.downwear': 'Bottom',
        'wardrobe.onepiece': 'One-piece',
        'wardrobe.emptyTitle': 'No clothes registered yet.',
        'wardrobe.emptyDesc': 'Start managing your wardrobe.',
        'wardrobe.addTitle': 'Add New Clothing',
        'wardrobe.addDesc': 'Upload a photo and AI will analyze it',
        'wardrobe.uploadHint1': 'Click or drag & drop a photo',
        'wardrobe.uploadHint2': 'Supports JPG, PNG, WEBP',
        'wardrobe.analyzeStart': 'Analyze with AI',
        'wardrobe.analyzing': 'AI is analyzing...',
        'wardrobe.resultTitle': 'Analysis Result (Editable)',
        'wardrobe.labelName': 'Clothing Name',
        'wardrobe.labelLocation': 'Location (e.g. First drawer, Bedroom closet)',
        'wardrobe.labelCategory': 'Category',
        'wardrobe.labelStyle': 'Style',
        'wardrobe.labelSeasons': 'Seasons (Multiple)',
        'wardrobe.labelColors': 'Colors (Comma separated)',
        'wardrobe.saveWardrobe': 'Save to Wardrobe',
        'wardrobe.notFound': 'Clothing not found',
        'wardrobe.back': 'Back to Wardrobe',
        'wardrobe.infoEdit': 'Edit Info',
        'wardrobe.propCategory': 'Category',
        'wardrobe.propStyle': 'Style',
        'wardrobe.propColor': 'Color',
        'wardrobe.propLocation': 'Location',
        'wardrobe.propSeason': 'Season',

        'recommend.title': 'Outfit Recommendation',
        'recommend.desc': 'Get 3 outfit recommendations for today\'s weather',
        'recommend.reqText': 'Please register at least 1 top and 1 bottom.',
        'recommend.weatherLoading': 'Loading weather info...',
        'recommend.button': 'Get Recommended Outfits',
        'recommend.buttonAgain': 'Get Different Recommendations',
        'recommend.loading': 'AI is generating outfits...',
        'recommend.resultTitle': 'Recommended Outfits',
        'recommend.preview': 'Preview (Beta)',
        'recommend.previewLoading': 'AI is trying on the clothes...',

        'history.title': 'My Style',
        'history.desc': 'Check out your favorite saved outfits',
        'history.empty': 'No favorite outfits yet.',

        'weather.temp': 'Temp',
        'weather.feelsLike': 'Feels Like',
        'weather.humidity': 'Humidity',
        'weather.loadingRetry': 'Loading weather... (Click to retry)',

        'contact.developedBy': 'Developed by',
        'contact.tagline': 'AI-powered weather-based outfit recommendations',
        'contact.title': 'Contact Us',
        'contact.name': 'Name',
        'contact.email': 'Email',
        'contact.message': 'Message',
        'contact.messagePlaceholder': 'How can we help you?',
        'contact.send': 'Send Message',
        'contact.sent': 'Message sent successfully!',
        'contact.sentDesc': 'We will review your message and get back to you.',
    }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en')

    // Load preferred language from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('app_language') as Language
        if (saved === 'ko' || saved === 'en') {
            setLanguage(saved)
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem('app_language', lang)
    }

    const t = (key: string, variables?: Record<string, string | number>) => {
        let str = dictionaries[language][key] || key
        if (variables) {
            Object.entries(variables).forEach(([k, v]) => {
                str = str.replace(`{{${k}}}`, String(v))
            })
        }
        return str
    }

    return (
        <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </I18nContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(I18nContext)
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider')
    }
    return context
}
