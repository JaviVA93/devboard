import ClampCalculator from "@/components/clamp-calculator/ClampCalculator"
import CodeEditor from "@/components/code-editor/CodeEditor"
import ColorPicker from "@/components/color-picker/ColorPicker"
import Pomodoro from "@/components/pomodoro/Pomodoro"
import SvgToComponent from "@/components/svg-to-component/SvgToComponent"
import ToDo from "@/components/to-do/toDo"
import Weather from "@/components/weather/weather"

export const PATHS = {
    HOME: '/',
    LOGIN: '/login',
    LOGIN_SUCCES: '/login-success',
    PROFILE: '/profile',
    BOARD: '/',
    ABOUT: '/about',
    APIS: {
        LOGIN: '/api/login',
        SIGNUP: '/api/signup',
        TODOS: '/api/todos',
        WEATHR: '/api/weather',
        BOARD_TOOLS: '/api/board-tools',
    }
}

export const IMAGES = {
    PROFILE_DEFAULT: '/images/t-pose-100.png'
}


export const TOOLS_LIST = [{
    id: 'pomodoro',
    component: <Pomodoro />,
    name: 'Pomodoro',
    imagePreviewPath: '/svg/undraw_time_management_re_tk5w.svg',
    mainCardColor: '#567794',
    titleColor: '#151b24',
},
{
    id: 'todo',
    component: <ToDo />,
    name: 'To-Do List',
    imagePreviewPath: '/svg/undraw_to_do_re_jaef.svg',
    mainCardColor: '#76B576',
    titleColor: '#1B291B',
},
{
    id: 'clampcalc',
    component: <ClampCalculator />,
    name: 'Clamp Calculator',
    imagePreviewPath: '/svg/undraw_file_bundle_re_6q1e.svg',
    mainCardColor: '#AB7B76',
    titleColor: '#c9c9c9',
}, {
    id: 'weather',
    component: <Weather />,
    name: 'Weather',
    imagePreviewPath: '/svg/undraw_weather_re_qsmd.svg',
    mainCardColor: '#ffffff',
    titleColor: '#2e6dcc',
}, {
    id: 'colorpicker',
    component: <ColorPicker />,
    name: 'Color Picker',
    imagePreviewPath: '/svg/undraw_specs_re_546x.svg',
    mainCardColor: '#960093',
    titleColor: '#ffffff',
}, {
    id: 'codeeditor',
    component: <CodeEditor />,
    name: 'Code Editor',
    imagePreviewPath: '/svg/undraw_code_review_re_woeb.svg',
    mainCardColor: '#7F90F5',
    titleColor: '#F5F067',
}, {
    id: 'svg2jsx',
    component: <SvgToComponent />,
    name: 'SVG to JSX',
    imagePreviewPath: '/svg/undraw_react_re_g3ui.svg',
    mainCardColor: '#A14300',
    titleColor: '#00D9ED',
}]