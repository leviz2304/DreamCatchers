package com.example.demo.config;

import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.user.Role;
import static com.example.demo.entity.user.Permission.*;
import com.example.demo.handler.LogoutHandler;
import com.example.demo.handler.Oauth2SuccessHandler;
import com.example.demo.jwt.JwtFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final LogoutHandler logoutHandler;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;

    @Bean
    public AccessDeniedHandler accessDeniedHandler () {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            ResponseObject res = ResponseObject.builder().status(HttpStatus.FORBIDDEN).mess("You don't have permission!").build();
            ObjectMapper mapper = new ObjectMapper();
            response.getWriter().write(mapper.writeValueAsString(res));
            response.getWriter().flush();
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
//                .cors(AbstractHttpConfigurer::disable) vô hiệu hóa cấu hình mặc định và cấu hình CORS riêng
                 .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/v1/public/**", "/ws/**").permitAll()
                        .requestMatchers("/api/v1/user/**").hasAnyRole(Role.USER.name(), Role.ADMIN.name(), Role.MANAGER.name())
                        .requestMatchers(HttpMethod.GET, "/api/v1/private/**").hasAnyAuthority(ADMIN_READ.name(), MANAGER_READ.name())
                        .requestMatchers(HttpMethod.POST, "/api/v1/private/**").hasAnyAuthority(ADMIN_CREATE.name(), MANAGER_CREATE.name())
                        .requestMatchers(HttpMethod.PUT, "/api/v1/private/**").hasAnyAuthority(ADMIN_UPDATE.name(), MANAGER_UPDATE.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/private/**").hasAuthority(ADMIN_DELETE.name())
                        .anyRequest()
                        .permitAll()
                )
                .logout(logout -> logout.logoutUrl("/api/v1/me/logout")
                        .addLogoutHandler(logoutHandler)
                        .logoutSuccessHandler(((request, response, authentication) -> {
                            SecurityContextHolder.clearContext();
                            response.setStatus(HttpServletResponse.SC_OK);
                        }))
                )
//                .authenticationProvider(authenticationProvider)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(restAuthenticationEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
//                .exceptionHandling(exception -> exception.accessDeniedHandler(accessDeniedHandler()))
                .build();
    }
}
