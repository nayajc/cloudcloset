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

        'nav.home': '홈',
        'nav.wardrobe': '옷장',
        'nav.recommend': '추천',
        'nav.history': '히스토리',

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

        'history.title': '추천 히스토리',
        'history.desc': '과거에 추천받았던 코디들을 확인하세요',
        'history.empty': '아직 추천받은 코디 내역이 없어요.',

        'weather.temp': '기온',
        'weather.feelsLike': '체감',
        'weather.humidity': '습도',
    },
    en: {
        'brand.subtitle': 'AI Outfit Recommendations based on your wardrobe',
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

        'nav.home': 'Home',
        'nav.wardrobe': 'Wardrobe',
        'nav.recommend': 'Recommend',
        'nav.history': 'History',

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

        'history.title': 'Recommendation History',
        'history.desc': 'Check out your past outfit recommendations',
        'history.empty': 'No recommendation history yet.',

        'weather.temp': 'Temp',
        'weather.feelsLike': 'Feels Like',
        'weather.humidity': 'Humidity',
    }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('ko')

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
