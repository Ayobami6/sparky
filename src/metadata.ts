/* eslint-disable */
export default async () => {
    const t = {
        ["typeorm/driver/mongodb/bson.typings"]: await import("typeorm/driver/mongodb/bson.typings"),
        ["./user/types"]: await import("./user/types"),
        ["./notification/notification.entity"]: await import("./notification/notification.entity"),
        ["./user/user.entity"]: await import("./user/user.entity"),
        ["./course/course.entity"]: await import("./course/course.entity")
    };
    return { "@nestjs/swagger": { "models": [[import("./user/user.entity"), { "UserEntity": { _id: { required: true, type: () => t["typeorm/driver/mongodb/bson.typings"].ObjectId }, id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: true, type: () => String }, role: { required: true, type: () => String }, avatar: { required: true, type: () => Object }, isVerified: { required: true, type: () => Boolean }, courses: { required: true, type: () => [String] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./user/dto/create-use.dto"), { "CreateUserDto": { email: { required: true, type: () => String }, name: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 8, pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/" }, avatar: { required: true, type: () => Object } }, "SocialAuthDto": { email: { required: true, type: () => String }, name: { required: true, type: () => String }, avatar: { required: true, type: () => Object } } }], [import("./user/dto/verification.dto"), { "VerificationDto": { activationToken: { required: true, type: () => String }, activation_code: { required: true, type: () => Number } } }], [import("./user/dto/update-user.dto"), { "UpdateUserDto": { name: { required: true, type: () => String }, avatar: { required: true, type: () => Object } } }], [import("./user/dto/change-password.dto"), { "ChangePasswordDto": { oldPassword: { required: true, type: () => String }, newPassword: { required: true, type: () => String, minLength: 8, pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/" } } }], [import("./user/dto/update-user-role.dto"), { "UpdateUserRoleDto": { role: { required: true, enum: t["./user/types"].RoleEnum }, userId: { required: true, type: () => String } } }], [import("./auth/dto/login-user.dto"), { "LoginUserDto": { email: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 8, pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/" } } }], [import("./course/course.entity"), { "CourseEntity": { _id: { required: true, type: () => t["typeorm/driver/mongodb/bson.typings"].ObjectId }, id: { required: true, type: () => String }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, price: { required: true, type: () => Number }, estimatedPrice: { required: true, type: () => Number }, thumbnail: { required: true, type: () => Object }, tags: { required: true, type: () => [String] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, level: { required: true, type: () => String }, demoUrl: { required: true, type: () => String }, benefits: { required: true, type: () => [Object] }, prerequisites: { required: true, type: () => [Object] }, reviews: { required: true, type: () => [Object] }, courseData: { required: true, type: () => [Object] }, ratings: { required: true, type: () => Number }, purchased: { required: true, type: () => Number } } }], [import("./course/dto/create-course.dto"), { "CreateCourseDto": { name: { required: true, type: () => String }, description: { required: true, type: () => String }, price: { required: true, type: () => Number }, estimatedPrice: { required: true, type: () => Number }, id: { required: true, type: () => String }, thumbnail: { required: false, type: () => Object }, level: { required: true, type: () => String }, tags: { required: true, type: () => [String] }, demoUrl: { required: true, type: () => String }, reviews: { required: true, type: () => [Object] }, benefits: { required: true, type: () => [Object] }, prerequisites: { required: true, type: () => [Object] }, courseData: { required: true, type: () => [Object] }, ratings: { required: false, type: () => Number }, purchased: { required: false, type: () => Number } } }], [import("./course/dto/editcourse.dto"), { "EditCourseDto": { name: { required: true, type: () => String }, description: { required: true, type: () => String }, price: { required: true, type: () => Number }, estimatedPrice: { required: true, type: () => Number }, thumbnail: { required: false, type: () => Object }, level: { required: true, type: () => String }, tags: { required: true, type: () => [String] }, demoUrl: { required: true, type: () => String }, reviews: { required: true, type: () => [Object] }, benefits: { required: true, type: () => [Object] }, prerequisites: { required: true, type: () => [Object] }, courseData: { required: true, type: () => [Object] }, ratings: { required: false, type: () => Number }, purchased: { required: false, type: () => Number } } }], [import("./course/dto/add-question.dto"), { "QuestionDto": { question: { required: true, type: () => String }, courseId: { required: true, type: () => String }, contentId: { required: true, type: () => String } }, "QuestionReplyDto": { reply: { required: true, type: () => String }, questionId: { required: true, type: () => String }, contentId: { required: true, type: () => String }, courseId: { required: true, type: () => String } } }], [import("./course/dto/add-review.dto"), { "AddReviewDTO": { review: { required: true, type: () => String }, rating: { required: true, type: () => Number } }, "ReviewReplyDto": { reply: { required: true, type: () => String }, reviewId: { required: true, type: () => String } } }], [import("./notification/notification.entity"), { "NotificationEntity": { _id: { required: true, type: () => t["typeorm/driver/mongodb/bson.typings"].ObjectId }, id: { required: true, type: () => String }, title: { required: true, type: () => String }, message: { required: true, type: () => String }, userId: { required: true, type: () => String }, status: { required: true, enum: t["./notification/notification.entity"].Status }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./order/order.entity"), { "OrderEntity": { _id: { required: true, type: () => t["typeorm/driver/mongodb/bson.typings"].ObjectId }, id: { required: true, type: () => String }, userId: { required: true, type: () => String }, courseId: { required: true, type: () => String }, payment_info: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./order/dto/create-order.dto"), { "CreateOrderDto": { courseId: { required: true, type: () => String }, payment_info: { required: true, type: () => Object } } }], [import("./layout/layout.entity"), { "LayoutEntity": { _id: { required: true, type: () => t["typeorm/driver/mongodb/bson.typings"].ObjectId }, id: { required: true, type: () => String }, type: { required: true, type: () => String }, faq: { required: true, type: () => [Object] }, categories: { required: true, type: () => [Object] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./layout/dto/create-layout.dto"), { "CreateLayoutDto": { type: { required: true, type: () => String }, faq: { required: true, type: () => [Object] }, categories: { required: true, type: () => [Object] } } }], [import("./notification/dto/notification-status.dto"), { "NotificationStatusDto": { status: { required: true, enum: t["./notification/notification.entity"].Status } } }]], "controllers": [[import("./app.controller"), { "AppController": { "getHello": { type: Object }, "testServer": { type: Object }, "testRedis": { type: Object }, "getUserInfo": { type: t["./user/user.entity"].UserEntity } } }], [import("./user/user.controller"), { "UserController": { "getUserInfo": { type: t["./user/user.entity"].UserEntity }, "updateUser": { type: Object }, "changePassword": { type: Object }, "changeAvatar": { type: Object }, "getAllUsers": { type: Object }, "updateUserRole": { type: Object }, "deleteUser": { type: Object } } }], [import("./auth/auth.controller"), { "AuthController": { "signup": { type: Object }, "verify": { type: t["./user/user.entity"].UserEntity }, "login": { type: Object }, "refreshToken": { type: Object }, "socialAuth": { type: Object } } }], [import("./course/course.controller"), { "CourseController": { "uploadCourse": { type: t["./course/course.entity"].CourseEntity }, "editCourse": { type: t["./course/course.entity"].CourseEntity }, "getCourseForAllUsers": { type: t["./course/course.entity"].CourseEntity }, "getAllCourses": { type: [t["./course/course.entity"].CourseEntity] }, "findCourseById": { type: Object }, "addQuestion": { type: Object }, "replyQuestion": { type: Object }, "addReview": { type: Object }, "editReview": { type: Object }, "allCourses": { type: Object }, "deleteCourse": { type: Object } } }], [import("./order/order.controller"), { "OrderController": { "createOrder": { type: Object }, "getAllOrders": { type: Object } } }], [import("./notification/notification.controller"), { "NotificationController": { "getAllNotifications": { type: Object }, "updateNotificationStatus": { type: Object } } }], [import("./analytics/analytics.controller"), { "AnalyticsController": { "getAnalytics": { type: Object } } }], [import("./layout/layout.controller"), { "LayoutController": { "createLayout": { type: Object }, "editLayout": { type: Object }, "getLayoutByType": { type: Object } } }]] } };
};