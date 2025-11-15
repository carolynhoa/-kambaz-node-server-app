import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  const enrollUserInCourse = (userId, courseId) => {
    const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
    db.enrollments = [...db.enrollments, newEnrollment];
  };

  const unenrollUserFromCourse = (userId, courseId) => {
    db.enrollments = db.enrollments.filter(
      (e) => !(e.user === userId && e.course === courseId)
    );
  };

  const findCoursesForUser = (userId) => {
    const courseIds = db.enrollments
      .filter((e) => e.user === userId)
      .map((e) => e.course);
    return db.courses.filter((c) => courseIds.includes(c._id));
  };

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findCoursesForUser,
  };
}