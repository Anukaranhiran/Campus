import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StudentProfile {
    id: string;
    branch: string;
    interests: Array<string>;
    year: bigint;
    skills: Array<string>;
}
export interface CareerSuggestion {
    projectIdeas: Array<string>;
    skillRoadmap: Array<string>;
    resumeTips: Array<string>;
    studyPlan: Array<string>;
    internshipDomains: Array<string>;
}
export interface AttendanceRisk {
    classesNeeded: bigint;
    riskLevel: string;
    percentage: number;
}
export interface AttendanceInput {
    totalClasses: bigint;
    attendedClasses: bigint;
    remainingClasses: bigint;
}
export interface backendInterface {
    addCareerSuggestion(studentId: string, suggestion: CareerSuggestion): Promise<void>;
    addStudent(profile: StudentProfile): Promise<void>;
    calculateAttendanceRisk(input: AttendanceInput): Promise<AttendanceRisk>;
    getAllStudents(): Promise<Array<StudentProfile>>;
    getCareerSuggestion(id: string): Promise<CareerSuggestion>;
    getStudentProfile(id: string): Promise<StudentProfile>;
}
