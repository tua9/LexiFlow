package com.tuan.learningservice.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(com.tuan.learningservice.exception.ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFound(RuntimeException ex) {
                return response(HttpStatus.NOT_FOUND, ex.getMessage());
        }

        @ExceptionHandler(com.tuan.learningservice.exception.ForbiddenException.class)
        public ResponseEntity<ErrorResponse> handleForbidden(RuntimeException ex) {
                return response(HttpStatus.FORBIDDEN, ex.getMessage());
        }

        @ExceptionHandler({IllegalStateException.class, AuthenticationCredentialsNotFoundException.class})
        public ResponseEntity<ErrorResponse> handleUnauthorized(Exception ex) {
                return response(HttpStatus.UNAUTHORIZED, ex.getMessage());
        }

        @ExceptionHandler(com.tuan.learningservice.exception.DuplicateResourceException.class)
        public ResponseEntity<ErrorResponse> handleConflict(RuntimeException ex) {
                return response(HttpStatus.CONFLICT, ex.getMessage());
        }

        @ExceptionHandler({MethodArgumentNotValidException.class, MethodArgumentTypeMismatchException.class})
        public ResponseEntity<ErrorResponse> handleValidation(Exception ex) {
                String message = ex instanceof MethodArgumentNotValidException validation
                                ? validation.getBindingResult().getFieldErrors().stream()
                                .findFirst().map(error -> error.getField() + ": " + error.getDefaultMessage()).orElse("Validation failed")
                                : "Invalid request parameter";
                return response(HttpStatus.BAD_REQUEST, message);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ErrorResponse> handleAccessDenied(Exception ex) {
                return response(HttpStatus.FORBIDDEN, "Access denied");
        }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex) {
        return response(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        return response(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    private ResponseEntity<ErrorResponse> response(HttpStatus status, String message) {
        ErrorResponse error = ErrorResponse.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(status).body(error);
    }
}